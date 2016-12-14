PreviewDb = new Mongo.Collection('preview');

Router.route('/preview',{
  name: "preview",
  template: "previewTemplate"
});


if(Meteor.isClient) {

  Template.previewTemplate.onRendered(function() {
    Session.set('userId',"previewUser");
    Session.set('previewLang',"en");
  });

  Template.timePreview.onRendered(function() {
    this.$('.clockpicker').clockpicker({
      donetext: 'Done',
      afterDone: function() {
        this.$('.time').trigger('change');
      }
    });
  });

  Template.previewTemplate.helpers({
    'renderSavedData': function(id) {
      Meteor.call('renderAnswers', Session.get('userId'), function(error, result) {
        for(var i of result) {
          switch(i.type) {
            case "mcq":
              console.log(i.option);
              console.log('.mcq_radio_button_preview[value="' + i.option + '"]');
              console.log($('.mcq_radio_button_preview[value="' + i.option + '"]').attr('checked', true));
              break;
            case "maq":
              console.log(i.options);
              for(var j of i.options) {
                console.log(j.option);
                $('.maq_checkbox_button_preview[value=' + j.option + ']').attr('checked', true);
              }
              break;
            default:
              console.log("Unable to find specified type of question...");
          }
        }
      });
    },
    'languageReturn': function() {
      return LanguageList.find({enabled: 'y'});
    },
    'pageReturn': function() {
      return PageList.find({},{sort: {order: 1}});
    },
    'sectionReturn': function(id) {
      return SectionList.find({page: id},{sort: {order: 1}});
    },
    'questionReturn': function(id) {
      var lang = Session.get('previewLang');
      var langDb = detectLangDb(lang);
      /*
      if(!lang) {
        langDb = detectLangDb("en");
      } else {
        langDb = detectLangDb(lang);
      }
      */
      return langDb.find({section: id}, {sort: {order: 1}});
    },
    'questionPreviewTemplateType': function() {
      var ptType = this.type + "Preview";
      return ptType;
    }
  });

  Template.conditionalPreview.helpers({
    'getQuestionType': function() {
      
    }
  });

  Template.previewTemplate.events({
    'change .preview_lang_select': function(event) {
      //console.log($(event.target).val());
      var pLang = $(event.target).val();
      console.log(pLang);
      Session.set('previewLang', pLang);
    }
  });

  Template.mcqPreview.events({
    'click .mcq_radio_button_preview': function(event) {
      var user = Session.get('userId');
      var lang = Session.get('previewLang');
      var qid = $(event.target).attr('name');
      var oid = $(event.target).attr('value');
      Meteor.call('mcqAddResponse', user, lang, qid, oid);
      Meteor.call('mcqAddConditionalQuestions', user, lang, qid, oid ,function(error, result) {
        if(error) {
          console.log(error);
        } else {

        }
      });
    }
  });

  Template.maqPreview.events({
    'click .maq_checkbox_button_preview': function(event) {
      var user = Session.get('userId');
      var lang = Session.get('previewLang');
      var qid = $(event.target).attr('name');
      var oid = $(event.target).attr('value');
      var isOptionSelected = event.target.checked;
      Meteor.call('maqAddResponse', user, lang, qid, oid, isOptionSelected);
    }
  });

  Template.timePreview.events({
    'change .time': function(event) {
      var user = Session.get('userId');
      var lang = Session.get('previewLang');
      var tmp = $(event.target).attr('name').split(':');
      var qid = tmp[0];
      var oid = tmp[1];
      console.log(user + " " + lang + " " + qid + " " + oid);
    }
  });

}

if(Meteor.isServer) {

  Meteor.methods({
    'mcqAddResponse': function(user, lang, qid, oid) {
      var tmp = PreviewDb.find({user_id: user, question_id: qid}).count();
      if(tmp === 0) {
        PreviewDb.insert({
          user_id: user,
          question_id: qid,
          language: lang,
          type: "mcq",
          option: oid,
        });
      } else {
        PreviewDb.update({user_id: user, question_id: qid}, {$set: {option: oid, language: lang}});
      }
    },
    'maqAddResponse': function(user, lang, qid, oid, isOptionSelected) {
      if(isOptionSelected) {
        var tmp = PreviewDb.find({user_id: user, question_id: qid}).count();
        if(tmp === 0) {
          PreviewDb.insert({
            user_id: user,
            question_id: qid,
            language: lang,
            type: "maq",
            options: [{option: oid}]
          });
        } else {
          PreviewDb.update({user_id: user, question_id: qid}, {$push: {options: {option: oid}}});
        }
      } else {
        PreviewDb.update({user_id: user, question_id: qid}, {$pull: {options: {option: oid}}});
      }
    },
    'renderAnswers': function(userId) {
      console.log(userId);
      return PreviewDb.find({user_id: userId}).fetch();
    }
  });

}
