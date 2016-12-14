Router.route('/',{
  name: "home",
  template: "pageTemplate"
});

if(Meteor.isClient) {

  Template.pageTemplate.helpers({
    'pageReturn': function() {
      return PageList.find({},{sort: {order: 1}});
    }
  });

  Template.languageHeader.helpers({
    'languageReturn': function() {
      return LanguageList.find({enabled: 'y'});
    },
    'noneLanguageSelected': function() {
      Meteor.call('getDispLang2', function(error, result) {
        if(error) {
          console.error(error);
        } else {
          if(result == "none") {
            return true;
          }
          return false;
        }
      });
    }
  });

  Template.sectionTemplate.helpers({
    'sectionReturn': function(id) {
      var page_id = id;
      return SectionList.find({page: page_id},{sort: {order: 1}});
    },
    'sectionTemplateType': function() {
      var sType = this.type;
      return sType + "Input";
    }
  });

  Template.singleQuestionView.helpers({
    'getQuestionWithLanguage1': function(id) {
      var lang1 = DisplayLanguage.findOne({_id: "1"}).language;
      var langDb1 = detectLangDb(lang1);
      return langDb1.findOne({_id: id});
    },
    'getDispLang1': function() {
      var lang1 = DisplayLanguage.findOne({_id: "1"}).language;
      var dispLang1 = LanguageList.findOne({language: lang1});
      return dispLang1;
    },
    'questionTemplateType': function() {
      tType = this.type + "Input";
      return tType;
    }
  });

  Template.multipleQuestionView.helpers({
    'getQuestionWithLanguage1': function(id) {
      var lang1 = DisplayLanguage.findOne({_id: "1"}).language;
      var langDb1 = detectLangDb(lang1);
      return langDb1.findOne({_id: id});
    },
    'getQuestionWithLanguage2': function(id) {
      var lang2 = DisplayLanguage.findOne({_id: "2"}).language;
      var langDb2 = detectLangDb(lang2);
      return langDb2.findOne({_id: id});
    },
    'getDispLang1': function() {
      var lang1 = DisplayLanguage.findOne({_id: "1"}).language;
      var dispLang1 = LanguageList.findOne({language: lang1});
      return dispLang1;
    },
    'getDispLang2': function() {
      var lang2 = DisplayLanguage.findOne({_id: "2"}).language;
      var dispLang2 = LanguageList.findOne({language: lang2});
      return dispLang2;
    },
    'questionTemplateType': function() {
      tType = this.type + "Input";
      return tType;
    }
  });

  Template.questionTemplate.helpers({
    'noneDisplaySelected': function() {
      var lang2 = DisplayLanguage.findOne({_id: "2"}).language;
      if(lang2 == "none") {
        return true;
      }
      return false;
    },
    'questionReturn': function(id) {
      var section_id = id;
      return QuestionListEn.find({section: section_id},{sort: {order: 1}});
    }
  });

  Template.timeQuestionTemplate.helpers({
    'noneDisplaySelected': function() {
      var lang2 = DisplayLanguage.findOne({_id: "2"}).language;
      if(lang2 == "none") {
        return true;
      }
      return false;
    },
    'questionReturn': function(id) {
      var section_id = id;
      return QuestionListEn.find({section: section_id},{sort: {order: 1}});
    }
  });

  Template.pageTemplate.onRendered(function() {
    this.$('#pages').sortable({
      stop: function(e, ui) {
        var el = ui.item.get(0);
        var before = ui.item.prev().get(0);
        var after = ui.item.next().get(0);
        if(!before) {
          newOrder = Blaze.getData(after).order - 1;
        } else if(!after) {
          newOrder = Blaze.getData(before).order + 1;
        } else {
          newOrder = (Blaze.getData(after).order + Blaze.getData(before).order)/2;
        }
        PageList.update({_id: Blaze.getData(el)._id},{$set: {order: newOrder}});
      }
    });

  });

  Template.sectionTemplate.onRendered(function() {

    this.$('#sections').sortable({
      connectWith: '.sections_container',
      stop: function(e, ui) {
        var page_id = Session.get('drop_page_location');
        var el = ui.item.get(0);
        var before = ui.item.prev().get(0);
        var after = ui.item.next().get(0);
        if(!before) {
          newOrder = Blaze.getData(after).order - 1;
        } else if(!after) {
          newOrder = Blaze.getData(before).order + 1;
        } else if(!before && !after) {
          newOrder = 1;
        } else {
          newOrder = (Blaze.getData(after).order + Blaze.getData(before).order)/2;
        }
        SectionList.update({_id: Blaze.getData(el)._id},{$set: {page: page_id, order: newOrder}});
      }
    }).draggable({
      connectToSortable: 'sections'
    }).droppable({
      drop: function(e, ui) {
        Session.set('drop_page_location', $(e.target).attr('name'));
      }
    });

  });

  Template.timeQuestionTemplate.onRendered(function() {
    this.$('#timeQuestions').sortable({
      stop: function(e, ui) {
        var el = ui.item.get(0);
        var before = ui.item.prev().get(0);
        var after = ui.item.next().get(0);
        if(!before) {
          newOrder = Blaze.getData(after).order - 1;
        } else if(!after) {
          newOrder = Blaze.getData(after).order + 1;
        } else {
          newOrder = (Blaze.getData(after).order + Blaze.getData(before).order)/2;
        }
        Meteor.call('updateTimeQuestionOrder', Blaze.getData(el)._id, newOrder);
      }
    });
  });

  Template.questionTemplate.onRendered(function() {
    this.$('#questions').sortable({
      connectWith: '.questions_container',
      stop: function(e, ui) {
        var section_id = Session.get('drop_section_location');
        var el = ui.item.get(0);
        var before = ui.item.prev().get(0);
        var after = ui.item.next().get(0);
        if(!before) {
          newOrder = Blaze.getData(after).order - 1;
        } else if(!after) {
          newOrder = Blaze.getData(before).order + 1;
        } else if(!before && !after) {
          newOrder = 1;
        }
        else {
          newOrder = (Blaze.getData(after).order + Blaze.getData(before).order)/2;
        }
        Meteor.call('updateQuestionOrder', Blaze.getData(el)._id, section_id, newOrder);
        //QuestionListEn.update({_id: Blaze.getData(el)._id},{$set: {section: section_id, order: newOrder}});
      }
    }).draggable({
      connectToSortable: 'questions'
    }).droppable({
      drop: function(e, ui) {
        Session.set('drop_section_location', $(e.target).attr('name'));
      }
    });
  });

  Template.pageTemplate.events({
    'click .close_lang_add': function(event) {
      document.location.reload(true);
      //$('.lang_header').reload();
    },
    'click .disp_lang1_button': function(event) {
      Meteor.call('getDispLang1', function(error, result) {
        if(error) {
          console.error(error);
        } else {
          $(".select_display_lang_1[value='" + result + "']").attr('checked', true);
        }
      });
    },
    'click .select_display_lang_1': function(event) {
      Meteor.call('setDispLang1',$(event.target).attr('value'));
    },
    'click .disp_lang2_button': function(event) {
      Meteor.call('getDispLang2', function(error, result) {
        if(error) {
          console.error(error);
        } else {
          $(".select_display_lang_2[value='" + result + "']").attr('checked', true);
        }
      });
    },
    'click .select_display_lang_2': function(event) {
      Meteor.call('setDispLang2',$(event.target).attr('value'));
    },
    'click .add_lang_button': function(event) {
      var enabledLanguages = Meteor.call('getEnabledLanguages', function(error, result) {
        if(error) {
          console.error(error);
        } else {
          for(var i of result) {
            $(".lang_add[val='" + i.language + "']").attr('checked', true);
          }
        }
      });
    },
    'change .lang_add': function(event) {
      var isLangTrue = event.target.checked;
      var lang = $(event.target).attr('val');
      var dispLang = $(event.target).attr('display');
      if(isLangTrue) {
        Meteor.call('addLanguage', lang, dispLang);
      } else {
        Meteor.call('removeLanguage', lang);
      }
    },
    'keyup .page_input_name': function(event) {
      var id = event.currentTarget.name;
      var pageText = $(event.target).val();
      Meteor.call('modifyPageText', id, pageText);
    },
    'keyup .section_input_name': function(event) {
      var id = event.currentTarget.name;
      var sectionText = $(event.target).val();
      Meteor.call('modifySectionText', id, sectionText);
    },
    'click .question_add_option': function(event) {
      var addQuestionType = $(event.target).attr('val');
      var id = this._id;
      Meteor.call('addQuestion', id, addQuestionType);
    },
    'click .section_add_option': function(event) {
      var addSectionType = $(event.target).attr('val');
      var pageId = this._id;
      Meteor.call('addSection', pageId, addSectionType);
    },
    'click .add_page': function(event) {
      Meteor.call('addPage');
    },
    'click .page_delete': function(event) {
      Meteor.call('deletePage', this._id);
    },
    'click .section_delete': function(event) {
      Meteor.call('deleteSection', this._id);
    },
    'click .question_delete': function(event) {
      Meteor.call('deleteQuestion', this._id);
    }
  });

}

if(Meteor.isServer) {

///////////////////////////////////////
  Meteor.startup(function() {
    var enLang = LanguageList.find({language: "en"}).count();
    if(enLang == 0) {
      LanguageList.insert({
        language: "en",
        displayName: "English",
        enabled: "y",
        primary: "y"
      });
    }
    var frLang = LanguageList.find({language: "fr"}).count();
    if(frLang == 0) {
      LanguageList.insert({
        language: "fr",
        displayName: "French",
        enabled: "n",
        primary: "n"
      });
    }
    var cnLang = LanguageList.find({language: "cn"}).count();
    if(cnLang == 0) {
      LanguageList.insert({
        language: "cn",
        displayName: "Canadian",
        enabled: "n",
        primary: "n"
      });
    }
    ////////////////////////////////////
    var dispLang1 = DisplayLanguage.find({_id: "1"}).count();
    var dispLang2 = DisplayLanguage.find({_id: "2"}).count();
    if(dispLang1==0) {
      DisplayLanguage.insert({
        _id: "1",
        language: "en"
      });
    }
    if(dispLang2==0) {
      DisplayLanguage.insert({
        _id: "2",
        language: "none"
      });
    }
  });
///////////////////////////////////////////////////

  Meteor.methods({
    'updateQuestionOrder': function(question_id, section_id, newOrder) {
      updateQuestionOrderLangDb(question_id, section_id, newOrder);
    },
    'updateTimeQuestionOrder': function(question_id, newOrder) {
      updateTimeQuestionOrderLangDb(question_id, newOrder);
    },
    'getDispLang1': function() {
      return DisplayLanguage.findOne({_id: "1"}).language;
    },
    'setDispLang1': function(lang) {
      DisplayLanguage.update({_id: "1"}, {$set: {language: lang}});
    },
    'getDispLang2': function() {
      return DisplayLanguage.findOne({_id: "2"}).language;
    },
    'setDispLang2': function(lang) {
      DisplayLanguage.update({_id: "2"}, {$set: {language: lang}});
    },
    'getEnabledLanguages': function() {
      console.log(LanguageList.find({enabled: 'y'}).fetch());
      return LanguageList.find({enabled: 'y'}).fetch();
    },
    'addLanguage': function(lang) {
      LanguageList.update({language: lang}, {$set: {enabled: "y"}});
    },
    'removeLanguage': function(lang) {
      LanguageList.update({language: lang}, {$set: {enabled: "n"}});
      if(DisplayLanguage.findOne({_id: "1"}).language == lang) {
        DisplayLanguage.update({_id: "1"}, {$set: {language: "en"}});
      }
      if(DisplayLanguage.findOne({_id: "2"}).language == lang) {
        DisplayLanguage.update({_id: "2"}, {$set: {language: "none"}});
      }
    },
    'addQuestion': function(sectionId, questionType) {
      addQuestionLangDb(sectionId, questionType);
		},
    'deleteQuestion': function(id) {
			removeQuestionLangDb(id);
		},
    'addSection': function(pageId, sectionType) {
      var sArray = SectionList.find({page: pageId}).fetch();
      if(sArray.length == 0) {
        SectionList.insert({name: "", page: pageId, type: sectionType, order: 1});
      } else {
        var sOrder = sArray[0].order;
        for(var i=1; i<sArray.length; i++) {
          if(sOrder < sArray[i].order) {
            sOrder = sArray[i].order;
          }
        }
        sOrder = sOrder + 1;
        SectionList.insert({name: "", page: pageId, type: sectionType, order: sOrder});
      }
    },
    'addPage': function() {
      var pArray = PageList.find({}).fetch();
      if(pArray.length == 0) {
        PageList.insert({name: "", order: 1});
      } else {
        var pOrder = pArray[0].order;
        for(var i=1; i<pArray.length; i++) {
          if(pOrder < pArray[i].order) {
            pOrder = pArray[i].order;
          }
        }
        pOrder = pOrder + 1;
        PageList.insert({name: "", order: pOrder});
      }
    },
    'deletePage': function(pageId) {
      var sArray = SectionList.find({page: pageId}).fetch();
      for(var i=0; i<sArray.length; i++) {
        removeQuestionLangDbBySection(sArray[i]._id);
      }
      SectionList.remove({page: pageId});
      PageList.remove({_id: pageId});
    },
    'deleteSection': function(sectionId) {
      removeQuestionLangDbBySection(sectionId);
      SectionList.remove({_id: sectionId});
    },
    'modifyPageText': function(pageId, pageText) {
      PageList.update({_id: pageId},{$set: {name: pageText}});
    },
    'modifySectionText': function(sectionId, sectionText) {
      SectionList.update({_id: sectionId},{$set: {name: sectionText}});
    },
    'addOption': function(id) {
      addOptionLanguageDb(id);
		},
    'deleteOption': function(id, onum) {
      removeOptionLanguageDb(id, onum);
		},
		'modifyQuestion': function(id, questionText, langDb) {
      modifyQuestionLangDb(id, questionText, langDb);
			//QuestionListEn.update({_id: id},{$set: {question: questionText}});
		},
		'modifyOptions': function(id, num, optionText, langDb) {
      console.log("modify option in language " + langDb);
      modifyOptionsLangDb(id, num, optionText, langDb);
			//QuestionListEn.update({_id: id, 'options.num': num},{$set: {'options.$.value': optionText}});
		},
  });

}
