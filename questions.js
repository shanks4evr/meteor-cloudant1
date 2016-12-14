if(Meteor.isClient) {

  Template.mcqInput.helpers({
    'conditionalQuestionType': function() {
      return this.type + "Input";
    },
    'isMcqRequiredChecked': function() {
      var check = QuestionListEn.findOne({_id: this._id}).required;
      if(check) {
        return true;
      } else {
        return false;
      }
    }
  });

  Template.maqInput.helpers({
    'getMinLimit': function() {
      var min = QuestionListEn.findOne({_id: this._id}).maxLimit;
      var minar = new Array();
      for(var i=0; i<=min; i++) {
        minar.push({num: i});
      }
      return minar;
    },
    'getMaxLimit': function() {
      var max = QuestionListEn.findOne({_id: this._id}).naop;
      var maxar = new Array();
      for(var i=1; i<=max; i++) {
        maxar.push({num: i});
      }
      return maxar;
    },
    'isMaqMinValueSelected': function(num, id) {
      var min = QuestionListEn.findOne({_id: id}).minLimit;
      if(num == min) {
        return true;
      } else {
        return false;
      }
    },
    'isMaqMaxValueSelected': function(num, id) {
      var max = QuestionListEn.findOne({_id: id}).maxLimit;
      if(num == max) {
        return true;
      } else {
        return false;
      }
    }
  });

  Template.maqConditionalInput.helpers({
    'getMinLimit': function() {
      var min = QuestionListEn.findOne({_id: this._id}).maxLimit;
      console.log(min);
      var minar = new Array();
      for(var i=0; i<=min; i++) {
        minar.push({num: i});
      }
      return minar;
    },
    'getMaxLimit': function() {
      var max = QuestionListEn.findOne({_id: this._id}).naop;
      var maxar = new Array();
      for(var i=1; i<=max; i++) {
        maxar.push({num: i});
      }
      return maxar;
    }
  });

  Template.timeInput.events({
		'change .time_question_input': function(event) {
			var id = event.currentTarget.name;
			var questionText = $(event.target).val();
      var langSelect = $(event.target).parent().attr('id');
			Meteor.call('modifyQuestion', id, questionText, langSelect);
		},
    'change .question_time_limit': function(event) {
      var id = event.currentTarget.name;
      var timeLimit = $(event.target).val();
      var pattern = new RegExp("([0-9]*[.])?[0-9]+");
      if(pattern.test(timeLimit)) {
        timeLimit = parseFloat(timeLimit);
        Meteor.call('modifyTimeLimit', id, timeLimit);
      } else {
        throw new Meteor.Error("Please enter a number...");
      }
    },
		'change .time_input_option_text': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			var optionText = $(event.target).val();
      var langSelect = $(event.target).parent().parent().parent().attr('id');
			Meteor.call('modifyOptions', id, num, optionText, langSelect);
		},
		'click .time_add_option': function(event) {
			var id = event.currentTarget.name.split(":")[0];
			Meteor.call('addOption', id);
		},
		'click .time_option_delete_button': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			Meteor.call('deleteOption', id, num);
		}
	});

  Template.conditionalQuestionDisplay.helpers({
    'conditionalQuestionReturn': function(id, lang) {
      console.log(id + " " + lang);
      var langDb = detectLangDb(lang);
      return langDb.find({questionId: id},{sort: {optionNum: 1, timeStamp: 1}});
    },
    'conditionalQuestionTemplateType': function() {
      var tmp = this.type + "ConditionalInput";
      return tmp;
    },
    'getOptionText': function(qid, onum, language) {
      var langDb = detectLangDb(language);
      var tmp = langDb.findOne({_id: qid}).options;
      for(var i of tmp) {
        if(i.num == onum) {
          return i.value;
        }
      }
    },
  });

  Template.questionTemplate.events({
    'click .conditional_question_collapse': function(event) {
      console.log($(event.target).attr('val'));
      $('.collapseConditionalPanel_' + $(event.target).attr('val')).collapse("toggle");
    },
    'click .conditional_question_add_option': function(event) {
      console.log("I execute from question template...");
      var tmp = $(event.target).attr('name').split(":");
      console.log(tmp);
      var qid = tmp[0];
      var oid = tmp[1];
      tmp = $(event.target).attr('val');
      var qtype = tmp;
      console.log("question details = " + qid + " " + oid + " " + qtype);
      Meteor.call('addConditionalQuestion', qid, oid, qtype);
      //var qid = template.;
      //console.log(qid);
    }
  });

  Template.mcqConditionalInput.events({
    'change .mcq_conditional_question_input': function(event) {
      var id = this._id;
      var lang = this.lang;
      var qText = $(event.target).val();
      Meteor.call('modifyConditionalQuestionText', id, lang, qText);
    },
    'change .mcq_conditional_input_option': function(event) {
      var tmp = $(event.target).attr('name').split(":");
      var id = tmp[0];
      var lang = tmp[1];
      var optionNum = tmp[2];
      var oText = $(event.target).val();
      Meteor.call('modifyConditionalOptionText', id, lang, optionNum, oText);
    },
    'click .mcq_conditional_add_option': function(event) {
			var id = event.currentTarget.name.split(":")[0];
			Meteor.call('addOption', id);
		},
		'click .mcq_conditional_option_delete_button': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			Meteor.call('deleteOption', id, num);
		}
  });

  Template.maqConditionalInput.events({
    'change .maq_conditional_question_input': function(event) {
      var id = this._id;
      var lang = this.lang;
      var qText = $(event.target).val();
      Meteor.call('modifyConditionalQuestionText', id, lang, qText);
    },
    'change .maq_conditional_input_option': function(event) {
      var tmp = $(event.target).attr('name').split(":");
      var id = tmp[0];
      var lang = tmp[1];
      var optionNum = tmp[2];
      var oText = $(event.target).val();
      Meteor.call('modifyConditionalOptionText', id, lang, optionNum, oText);
    },
    'click .maq_conditional_add_option': function(event) {
			var id = event.currentTarget.name.split(":")[0];
			Meteor.call('addOption', id);
		},
		'click .maq_conditional_option_delete_button': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			Meteor.call('deleteOption', id, num);
		},
    'change .min_maq_input': function(event) {
      var min = parseInt($(event.target).val());
      console.log(min);
      console.log(this._id);
      Meteor.call('changeMinValue', min, this._id);
    },
    'change .max_maq_input': function(event) {
      var max = parseInt($(event.target).val());
      console.log(max);
      console.log(this._id);
      Meteor.call('changeMaxValue', max, this._id);
    }
  });

  Template.mcqInput.events({
		'change .mcq_question_input': function(event) {
			var id = event.currentTarget.name;
			var questionText = $(event.target).val();
      var langSelect = $(event.target).parent().attr('id');
			Meteor.call('modifyQuestion', id, questionText, langSelect);
		},
		'change .mcq_input_option_text': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			var optionText = $(event.target).val();
      var langSelect = $(event.target).parent().parent().parent().attr('id');
			Meteor.call('modifyOptions', id, num, optionText, langSelect);
		},
		'click .mcq_add_option': function(event) {
			var id = event.currentTarget.name.split(":")[0];
			Meteor.call('addOption', id);
		},
		'click .mcq_option_delete_button': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			Meteor.call('deleteOption', id, num);
		},
    'change .req_mcq_input': function(event) {
      var isChecked = event.target.checked;
      var id = this._id;
      console.log("value = " + isChecked);
      if(isChecked) {
        Meteor.call('setRequiredTrue', id);
      } else {
        Meteor.call('setRequiredFalse', id);
      }
    }
	});

	Template.maqInput.events({
		'change .maq_question_input': function(event) {
			var id = event.currentTarget.name;
			var questionText = $(event.target).val();
      var langSelect = $(event.target).parent().attr('id');
			Meteor.call('modifyQuestion', id, questionText, langSelect);
		},
		'change .maq_input_option_text': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			var optionText = $(event.target).val();
      var langSelect = $(event.target).parent().parent().parent().attr('id');
			Meteor.call('modifyOptions', id, num, optionText, langSelect);
		},
		'click .maq_add_option': function(event) {
			var id = event.currentTarget.name.split(":")[0];
			Meteor.call('addOption', id);
		},
		'click .maq_option_delete_button': function(event) {
			var getStr = event.currentTarget.name.split(":");
			var id = getStr[0];
			var num = Number(getStr[1]);
			Meteor.call('deleteOption', id, num);
		},
    'change .min_maq_input': function(event) {
      var min = parseInt($(event.target).val());
      console.log(min);
      console.log(this._id);
      Meteor.call('changeMinValue', min, this._id);
    },
    'change .max_maq_input': function(event) {
      var max = parseInt($(event.target).val());
      console.log(max);
      console.log(this._id);
      Meteor.call('changeMaxValue', max, this._id);
    }
	});

  Template.commentInput.events({
    'change .comment_input': function(event) {
			var id = event.currentTarget.name;
			var questionText = $(event.target).val();
      var langSelect = $(event.target).parent().attr('id');
			Meteor.call('modifyQuestion', id, questionText, langSelect);
		}
  });

}

if(Meteor.isServer) {

  Meteor.methods({
    'addConditionalQuestion': function(qid, oid, qtype) {
      addConditionalQuestionLangDb(qid, oid, qtype);
    },
    'modifyConditionalQuestionText': function(id, language, questionText) {
      var langDb = detectLangDb(language);
      langDb.update({_id: id},{$set: {question: questionText}});
    },
    'modifyConditionalOptionText': function(id, language, num, optionText) {
      var langDb = detectLangDb(language);
      langDb.update({_id: id, 'options.num': parseInt(num)},{$set: {'options.$.value': optionText}});
    },
    'changeMinValue': function(min, id) {
      changeMinValueLangDb(id, min);
    },
    'changeMaxValue': function(max, id) {
      changeMaxValueLangDb(id, max);
    },
    'modifyTimeLimit': function(id, timeLimit) {
      modifyTimeLimitLangDb(id, timeLimit);
    },
    'setRequiredTrue': function(id) {
      setRequiredTrueLangDb(id);
    },
    'setRequiredFalse': function(id) {
      setRequiredFalseLangDb(id);
    }
  });
}
