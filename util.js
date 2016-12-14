PageList = new Mongo.Collection('page');
SectionList = new Mongo.Collection("section");
LanguageList = new Mongo.Collection("language");
QuestionListEn = new Mongo.Collection("question_en");
QuestionListFr = new Mongo.Collection("question_fr");
QuestionListCn = new Mongo.Collection("question_ca");
DisplayLanguage = new Mongo.Collection("displayLanguage");

detectLangDb = function(lang) {
  switch (lang) {
    case "en":
      return QuestionListEn;
      break;
    case "fr":
      return QuestionListFr;
      break;
    case "cn":
      return QuestionListCn;
      break;
    default:
      console.log("No language detected");
      break;
  }
}

updateQuestionOrderLangDb = function(question_id, section_id, newOrder) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: question_id},{$set: {section: section_id, order: newOrder}});
  }
}

updateTimeQuestionOrderLangDb = function(question_id, newOrder) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: question_id},{$set: {order: newOrder}});
  }
}

generateUniqueId = function() {
  while(true) {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    var count = QuestionListEn.find({_id: uniqid}).count();
    if(count == 0) {
      return uniqid;
    }
  }
}

addQuestionLangDb = function(sectionId, questionType) {
  qArray = QuestionListEn.find({section: sectionId}).fetch();
  if(qArray.length == 0) {
    var qOrder = 1;
  } else {
    var qOrder = qArray[0].order;
    for(var i=1; i<qArray.length; i++) {
      if(qOrder < qArray[i].order) {
        qOrder = qArray[i].order;
      }
    }
    qOrder = qOrder + 1;
  }
  var id = generateUniqueId();
  for(var i of LanguageList.find().fetch()) {
    var qLang = i.language;
    var langDb = detectLangDb(qLang);
    switch(questionType) {
      case "mcq":
        langDb.insert({
          _id: id,
          question: "",
          section: sectionId,
          order: qOrder,
          type: questionType,
          lang: qLang,
          noptions: 2,
          naop: 2,
          required: true,
          options: [
            {num: 1, value: ""},
            {num: 2, value: ""}
          ]
        });
        break;
      case "maq":
        langDb.insert({
          _id: id,
          question: "",
          section: sectionId,
          order: qOrder,
          type: questionType,
          lang: qLang,
          noptions: 2,
          naop: 2,
          minLimit: 0,
          maxLimit: 2,
          options: [
            {num: 1, value: ""},
            {num: 2, value: ""}
          ]
        });
        break;
      case "time":
          langDb.insert({
            _id: id,
            question: "",
            time: 0,
            section: sectionId,
            order: qOrder,
            type: questionType,
            lang: qLang,
            noptions: 2,
            options: [
              {num: 1, value: ""},
              {num: 2, value: ""}
            ]
          });
          break;
      case "comment":
        langDb.insert({
          _id: id,
          question: "",
          section: sectionId,
          order: qOrder,
          type: questionType,
          lang: qLang
        });
        break;
      default:
        console.log("No question type detected");
    }
  }
}

addConditionalQuestionLangDb = function(qid, oid, questionType) {
  var id = generateUniqueId();
  var ts = id.substr(1);
  for(var i of LanguageList.find().fetch()) {
    var qLang = i.language;
    var langDb = detectLangDb(qLang);
    switch(questionType) {
      case "mcq":
        langDb.insert({
          _id: id,
          question: "",
          questionId: qid,
          optionNum: oid,
          type: questionType,
          lang: qLang,
          timeStamp: ts,
          noptions: 2,
          naop: 2,
          required: true,
          options: [
            {num: 1, value: ""},
            {num: 2, value: ""}
          ]
        });
        break;
      case "maq":
        langDb.insert({
          _id: id,
          question: "",
          questionId: qid,
          optionNum: oid,
          type: questionType,
          lang: qLang,
          timeStamp: ts,
          noptions: 2,
          naop: 2,
          minLimit: 0,
          maxLimit: 2,
          options: [
            {num: 1, value: ""},
            {num: 2, value: ""}
          ]
        });
        break;
      default:
        console.log("No question type detected");
    }
  }
}

removeQuestionLangDb = function(id) {
  for(var i of QuestionListEn.find({questionId: id}).fetch()) {
    console.log("id of question to be removed is " + i._id);
    removeConditionalQuestionLangDb(i._id);
  }
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.remove({_id: id});
  }
}

removeConditionalQuestionLangDb = function(id) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.remove({_id: id});
  }
}

removeQuestionLangDbBySection = function(sectionId) {
  for(var i of QuestionListEn.find({section: sectionId}).fetch()) {
    removeQuestionLangDb(i._id);
  }
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.remove({section: sectionId});
  }
}

addOptionLanguageDb = function(id) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$inc: {noptions: 1}});
    langDb.update({_id: id},{$inc: {naop: 1}});
    nopt = langDb.findOne({_id: id}).noptions;
    langDb.update({_id: id},{$push: {options: {num: nopt, value: ""}}});
  }
}

removeOptionLanguageDb = function(id, onum) {
  console.log("qid = " + id + "  " + "onum = " + onum);
  console.log(typeof onum.toString());
  for(var i of QuestionListEn.find({questionId: id, optionNum: onum.toString()}).fetch()) {
    removeConditionalQuestionLangDb(i._id);
  }
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$inc: {naop: -1}});
    langDb.update({_id: id},{$pull: {options: {num: onum}}});
  }
}

modifyQuestionLangDb = function(id, questionText, lang) {
  if((lang == "lang1_single")||(lang == "lang1_multi")) {
    console.log("lang1 db change = " + DisplayLanguage.findOne({_id: "1"}).language);
    var langDb = detectLangDb(DisplayLanguage.findOne({_id: "1"}).language);
    langDb.update({_id: id},{$set: {question: questionText}});
  } else {
    console.log("lang2 db change = " + DisplayLanguage.findOne({_id: "2"}).language);
    var langDb = detectLangDb(DisplayLanguage.findOne({_id: "2"}).language);
    langDb.update({_id: id},{$set: {question: questionText}});
  }
}

modifyOptionsLangDb = function(id, num, optionText, lang) {
  if((lang == "lang1_single")||(lang == "lang1_multi")) {
    console.log("lang1 db change = " + DisplayLanguage.findOne({_id: "1"}).language);
    var langDb = detectLangDb(DisplayLanguage.findOne({_id: "1"}).language);
    langDb.update({_id: id, 'options.num': num},{$set: {'options.$.value': optionText}});
  } else {
    console.log("lang2 db change = " + DisplayLanguage.findOne({_id: "2"}).language);
    var langDb = detectLangDb(DisplayLanguage.findOne({_id: "2"}).language);
    langDb.update({_id: id, 'options.num': num},{$set: {'options.$.value': optionText}});
  }
}

changeMinValueLangDb = function(id, min) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$set: {minLimit: min}});
  }
}

changeMaxValueLangDb = function(id, max) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$set: {maxLimit: max}});
  }
}

modifyTimeLimitLangDb = function(id, timeLimit) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$set: {time: timeLimit}});
  }
}

setRequiredTrueLangDb = function(id) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$set: {required: true}});
  }
}

setRequiredFalseLangDb = function(id) {
  for(var i of LanguageList.find().fetch()) {
    var langDb = detectLangDb(i.language);
    langDb.update({_id: id},{$set: {required: false}});
  }
}
