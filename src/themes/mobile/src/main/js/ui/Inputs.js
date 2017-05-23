define(
  'tinymce.themes.mobile.ui.Inputs',

  [
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.api.ui.DataField',
    'ephox.alloy.api.ui.Input',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (AddEventsBehaviour, Behaviour, Composing, Representing, Toggling, Memento, AlloyEvents, NativeEvents, Button, Container, DataField, Input, Fun, Option, Styles) {
    var clearInputEvent = 'input-clearing';

    var field = function (name, placeholder) {
      var inputSpec = Memento.record(Input.sketch({
        placeholder: placeholder,
        onSetValue: function (input, data) {
          input.getSystem().triggerEvent('input', input.element(), {
            target: Fun.constant(input.element())
          });
        },
        inputBehaviours: Behaviour.derive([
          Composing.config({
            find: Option.some
          })
        ])
      }));

      var buttonSpec = Memento.record(
        Button.sketch({
          dom: {
            tag: 'button',
            classes: [
              Styles.resolve('input-container-x'),
              Styles.resolve('icon-cancel-circle'),
              Styles.resolve('icon')
            ]
          },
          action: function (button) {
            var input = inputSpec.get(button);
            Representing.setValue(input, '');
          }
        })
      );

      return {
        name: name,
        spec: Container.sketch({
          dom: {
            classes: [ Styles.resolve('input-container') ]
          },
          components: [
            inputSpec.asSpec(),
            buttonSpec.asSpec()
          ],
          containerBehaviours: Behaviour.derive([
            Toggling.config({
              toggleClass: Styles.resolve('input-container-empty')
            }),
            Composing.config({
              find: function (comp) {
                return Option.some(inputSpec.get(comp));
              }
            }),
            AddEventsBehaviour.config(clearInputEvent, [
              AlloyEvents.run(NativeEvents.input(), function (iContainer) {
                var input = inputSpec.get(iContainer);
                var val = Representing.getValue(input);
                var f = val.length > 0 ? Toggling.off : Toggling.on;
                f(iContainer);
              })
            ])
          ])
        })
      };
    };

    var hidden = function (name) {
      return {
        name: name,
        spec: DataField.sketch({
          dom: {
            tag: 'span',
            styles: {
              display: 'none'
            }
          },
          getInitialValue: function () {
            return Option.none();
          }
        })
      };
    };

    return {
      field: field,
      hidden: hidden
    };
  }
);