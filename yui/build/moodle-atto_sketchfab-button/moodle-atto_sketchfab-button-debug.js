YUI.add('moodle-atto_sketchfab-button', function (Y, NAME) {

// This file is part of Moodle - http://mdl.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with mdl.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_sketchfab
 * @copyright  2015 Jetha Chan <jetha@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_sketchfab-button
 */

/**
 * Atto text editor Sketchfab plugin. Largely based upon atto_media.
 *
 * @namespace M.atto_sketchfab
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */
var COMPONENTNAME = 'atto_sketchfab',
    CSS = {
        URLINPUT: 'atto_sketchfab_urlentry'
    },
    SELECTORS = {
        URLINPUT: '.' + CSS.URLINPUT
    },
    TEMPLATE = '' +
        '<form class="atto_form">' +
            '<label for="{{elementid}}_atto_sketchfab_urlentry">{{get_string "enterurl" component}}</label>' +
            '<input class="fullwidth {{CSS.URLINPUT}}" type="url" id="{{elementid}}_atto_sketchfab_urlentry" size="32"/><br/>' +
            '<div class="mdl-align">' +
                '<br/>' +
                '<button class="submit" type="submit">{{get_string "insertmodel" component}}</button>' +
            '</div>' +
        '</form>',
    SKETCHFAB_HOME_URL = 'sketchfab.com',
    TEMPLATE_EMBED = '' +
        '<div class="atto_sketchfab-embed">' +
            '<a href="{{mdl.asset}}">' +
            '<img class="atto_sketchfab-embed-thumb" src="{{thumbnail_url}}" />' +
            '</a>' +
            '<div class="atto_sketchfab-embed-desc">' +
                '{{{get_string "modeldesc" mdl.component modelname=mdl.asset author=mdl.profile sketchfab=mdl.svc }}}' +
            '</div>' +
        '</div>';


Y.namespace('M.atto_sketchfab').Button = Y.Base.create(
    'button',
    Y.M.editor_atto.EditorPlugin,
    [],
    {
        /**
         * A reference to the current selection at the time that the dialogue
         * was opened.
         *
         * @property _currentSelection
         * @type Range
         * @private
         */
        _currentSelection: null,

        /**
         * A reference to the dialogue content.
         *
         * @property _content
         * @type Node
         * @private
         */
        _content: null,

        initializer: function() {
            this.addButton({
                icon: 'e/insert_sketchfab',
                iconComponent: COMPONENTNAME,
                callback: this._displayDialogue
            });
        },

        /**
         * Display the media editing tool.
         *
         * @method _displayDialogue
         * @private
         */
        _displayDialogue: function() {
            // Store the current selection.
            this._currentSelection = this.get('host').getSelection();
            if (this._currentSelection === false) {
                return;
            }

            var dialogue = this.getDialogue({
                headerContent: M.util.get_string('insertmodel', COMPONENTNAME),
                focusAfterHide: true,
                focusOnShowSelector: SELECTORS.URLINPUT
            });

            // Set the dialogue content, and then show the dialogue.
            dialogue.set('bodyContent', this._getDialogueContent())
                    .show();
        },

        /**
         * Return the dialogue content for the tool, attaching any required
         * events.
         *
         * @method _getDialogueContent
         * @return {Node} The content to place in the dialogue.
         * @private
         */
        _getDialogueContent: function() {
            var template = Y.Handlebars.compile(TEMPLATE);

            this._content = Y.Node.create(template({
                component: COMPONENTNAME,
                elementid: this.get('host').get('elementid'),
                CSS: CSS
            }));

            this._content.one('.submit').on('click', this._setModel, this);

            return this._content;
        },

        /**
         * Update the model in the contenteditable.
         *
         * @method _setModel
         * @param {EventFacade} e
         * @private
         */
        _setModel: function(e) {
            e.preventDefault();
            this.getDialogue({
                focusAfterHide: null
            }).hide();

            var form = e.currentTarget.ancestor('.atto_form'),
                url = form.one(SELECTORS.URLINPUT).get('value'),
                host = this.get('host'),
                self = this;

            var urlok = url !== '' && url.indexOf(SKETCHFAB_HOME_URL) > -1;

            if (urlok) {
                host.setSelection(this._currentSelection);

                var tokens = url.split('/');
                var modeltoken = tokens[tokens.length - 1];

                // Kick off a request to Sketchfab's API.
                Y.io(
                    M.cfg.wwwroot + '/lib/editor/atto/plugins/sketchfab/api.php?modelid=' + modeltoken,
                    {
                        on: {
                            success: function (id, o) {
                                var sfdata = Y.JSON.parse(o.responseText);
                                sfdata.mdl = {};
                                sfdata.mdl.component = COMPONENTNAME;

                                var linkmeta = '?utm_source=oembed&utm_medium=embed&utm_campaign=' + modeltoken;

                                sfdata.mdl.asset =
                                    '<a href="' +
                                    sfdata.provider_url +
                                    '/models/' +
                                    modeltoken +
                                    linkmeta +
                                    '" target="_blank">' +
                                    sfdata.title +
                                    '</a>';
                                sfdata.mdl.profile =
                                    '<a href="' +
                                    sfdata.author_url + linkmeta +
                                    '" target="_blank">' +
                                    sfdata.author_name +
                                    '</a>';
                                sfdata.mdl.svc =
                                    '<a href="' +
                                    sfdata.provider_url + linkmeta +
                                    '" target="_blank">' +
                                    sfdata.provider_name +
                                    '</a>';

                                var template = Y.Handlebars.compile(TEMPLATE_EMBED);
                                var modelhtml = Y.Node.create(template(sfdata)).get('outerHTML');

                                host.insertContentAtFocusPoint(modelhtml);
                                self.markUpdated();

                            }
                        }
                    }
                );
            }
        }

    }
);


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
