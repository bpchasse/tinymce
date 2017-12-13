import { ApproxStructure } from '@ephox/agar';
import { Pipeline } from '@ephox/agar';
import { TinyApis } from '@ephox/mcagar';
import { TinyLoader } from '@ephox/mcagar';
import { TinyUi } from '@ephox/mcagar';
import VisualBlocksPlugin from 'tinymce/plugins/visualblocks/Plugin';
import ModernTheme from 'tinymce/themes/modern/Theme';
import { UnitTest } from '@ephox/refute';

UnitTest.asynctest(
  'browser.tinymce.plugins.visualblocks.VisualBlocksSanityTest',
  function() {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    VisualBlocksPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);
      Pipeline.async({}, [
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.not('mce-visualblocks')
            ]
          });
        })),
        tinyUi.sClickOnToolbar('click visualblocks button', 'div[aria-label="Show blocks"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.has('mce-visualblocks')
            ]
          });
        })),
        tinyUi.sClickOnToolbar('click visualblocks button', 'div[aria-label="Show blocks"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.not('mce-visualblocks')
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'visualblocks',
      toolbar: 'visualblocks',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);

