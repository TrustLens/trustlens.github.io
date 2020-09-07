// TrustLens Toolkit

// const 
const green = "success";
const greenhex = "#28A745";
const yellow = "warning"; 
const yellowhex = "#FFC107";
const red = "danger"; 
const redhex = "#DC3545";
const gray = "gray"; 
const lightgray = "lightgray"; 
const secondaryhex ="#6C757D";
const grayhex ="#808080";
const lightgrayhex ="#d3d3d3";
const black = "black";
const white = "white";


const please_select_one_or_more = "Please select at least one answer";
const please_select_one = "Please select one answer";
const please_insert = "Please insert an answer";

const topic_selection_text_string = "Please select the topic";

const this_is_the_last_question = "This is the last question";
const this_is_the_first_questiont = "This is the first question";

const no_question_in_this_topic = "No available question in this topic for the current settings";

const reached_end_of_questionnaire = "Reached the end of the questionnaire";

const will_delete_answers_and_comments = "This will delete all the current answers";

const please_follow_sequence_and_restart_from_first_ananswered = "Please follow the suggested sequence";
const this_question_is_not_available_role_stage = "This question is not available for the role(s) and stage selected";
const this_question_is_not_available_previous_answers = "This question is not available based on the current answers";

const no_questions_to_print = "The are no answers to print";

// vars

var questions = [];

var preliminary_questions = [   {   "index": 0,
                                    "code": "who",
                                    "question_text": "What are the roles of people completing this exercise?",
                                    "subtitle": "You may choose multiple options" ,
                                    "answer_type": "options_multiple",
                                    "answers_text": ["Managerial", "Technical Expert", "Operational", "Data subject"],
                                    "answers_value": ["m", "t", "o", "d"],
                                },
                                {   "index": 1,
                                    "code": "stage",
                                    "question_text": "Choose Your Stage",
                                    "subtitle": "Decide which stage applies to you",
                                    "answer_type": "options_single",
                                    "answers_text": ["There is a problem that needs to be solved", 
                                                     "There is an opportunity to use technology", 
                                                     "It has been decided which devices are to be used", 
                                                     "Devices are being deployed or are already deployed",
                                                     //"We have communicated to people about it"
                                                     ],
                                    "answers_value": ["s1", "s2", "s3", "s4"
                                                     //, "s5"
                                                     ],
                                }
                            ];


var topics_texts = ["People", "Purpose" , "Public Relations", "Comms Strategy" ,"System Deployment and Logistics" ,"System and Devices" ,"Collection and Use of Data" ,"Data Storage and Sharing" ,"Accountability and Governance" ,"Legal and Financial" ]

var topics_values = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10"];

var topics_hex = ["#a62f4c", "#4472c4", "#00b050", "#ed7d31", "#7030a0", "#ffc000", "#14ceca", "#5b9bd5", "#a9a9a9", "#ff0000"];


topics_hex.forEach( function(e, i) {topics_hex[i] = e + "a0"; });

var who_texts = preliminary_questions[0]["answers_text"];
var stages_texts = preliminary_questions[1]["answers_text"];


var questions_array = [];
var questions_map = {};


// to be saved in localStorage
var preliminary_questions_progress = 0;
var current_preliminary_question;
var current_preliminary_question_index = 0;
var preliminary_questions_answers = [];
var m = false, t = false, o = false, d = false;
var s1 = false, s2 = false, s3 = false, s4 = false, s5 = false;
var current_topic;
var current_topic_selected=topics_values[0];
var change_settings_progress = 2;
var current_question = 0;


// other 
var hide_overall = true;
var hide_overall_bar = true;

var bars = ["progress_bar_resolved", "progress_bar_viewed", "progress_bar_notviewed" ];
var bartitles = ["Resolved" , "For review", "Not read"];

var question_answer_text="question_answer_text";

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf('android') > -1;

var print_pdf_as_table = true;


function init() {
    getParametersInUrl();

    loadQuestionsFromJS();

    createQuestionsArray();

    loadDefaultValues();

    localStorage = window.localStorage;

    loadFromLocalStorage();

    // create missing divs
    buildProgressDiv();

    // set input button event 
    setInputAnswersJsonOnChangeEvent();

    goToCurrentQuestion();
}

function getParametersInUrl(){
    var parameters_in_url = new URLSearchParams(window.location.search);
    if ( parameters_in_url !=null ) 
        if (parameters_in_url.get("hide_overall") != null )
            hide_overall = parameters_in_url.get("hide_overall");
        if (parameters_in_url.get("hide_overall_bar") != null )
            hide_overall_bar = parameters_in_url.get("hide_overall_bar");
        if (parameters_in_url.get("print") != null )
            if (parameters_in_url.get("print") == "text")
                print_pdf_as_table = false;
            else
                print_pdf_as_table = true;
}

function loadQuestionsFromUrl() {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'questions.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send();  

    function callback(responseText) {
        questions = JSON.parse(responseText);
        console.log(JSON.stringify(questions));
    }
}


function loadQuestionsFromJS() {
    questions = questions_from_file;
}


function reset() {
    // alert !!!
    loadDefaultValues();
    deleteFromLocalStorage();
    goToFirstPreliminaryQuestion();
}

function loadDefaultValues() {
    preliminary_questions_progress = 0;
    current_preliminary_question;
    current_preliminary_question_index = 0;
    preliminary_questions_answers = [];
    m = false, t = false, o = false, d = false;
    s1 = false, s2 = false, s3 = false, s4 = false, s5 = false;
    current_topic;
    change_settings_progress = 2;
    current_question = 0;
}


function loadFirstPreliminaryQuestion() {

}


function deleteFromLocalStorage() {
    window.localStorage.clear();
    init();            
}

function removeChildren(n) {
    while (n.firstChild) {
        n.removeChild(n.firstChild);
    }
}


function hideAllDivsAndShowOnly(e) {
    divs = ["preliminary_questions_box", "topic_selection_box", "questions_box"];
    for (var d in divs) {
        if ( e != divs[d])
            document.getElementById(divs[d]).style.display = "none";
    }
    document.getElementById(e).style.display = "block";

    if (e=="questions_box") {
        document.getElementById("progress_panel").style.display = "block";
        document.getElementById("question_settings").style.display = "block";        
        document.getElementById("mainpanel").style.display = "";       
    } else {
        document.getElementById("progress_panel").style.display = "none";
        document.getElementById("question_settings").style.display = "none";
        document.getElementById("mainpanel").style.display = "none";       
    }
    
    

}


function goToCurrentQuestion() {
    // check current state !!!
    if (preliminary_questions_progress == 0)
        loadPreliminaryQuestion(0);
    else if (preliminary_questions_progress == 1)
        loadPreliminaryQuestion(1);
    else if (preliminary_questions_progress == 2) {
        console.log(current_question);
        if (current_question==null) { 
            current_question = 0;
        }
        goToQuestion(current_question);
    }
    else
        loadPreliminaryQuestion(0);
}


function loadPreliminaryQuestion(i) {
    current_preliminary_question = preliminary_questions[i];
    document.getElementById("preliminary_question_text").innerHTML = preliminary_questions[i]["question_text"];
    document.getElementById("preliminary_question_subtitle").innerHTML = preliminary_questions[i]["subtitle"];
    buildPreliminaryQuestionAnswer(i);
    hideAllDivsAndShowOnly("preliminary_questions_box");
}

function buildPreliminaryQuestionAnswer(pi) {
    var answer_radio = document.getElementById("preliminary_answer_radio");
    removeChildren(answer_radio);
    var answer_radio_html ="";
    var q = preliminary_questions[pi];
    var already_answered = ( preliminary_questions_answers != []  && preliminary_questions_answers[pi] != null );
    for (var i in q["answers_text"]) {
        if (q["answer_type"] == "options_single") {
            answer_radio_html += "<input type='radio' value='" + q["answers_value"][i] +"'"+ "name='preliminary_question_" + q["code"] + "'" + (already_answered && preliminary_questions_answers[pi][i] ? " checked " : "") + ">" +  " " + q["answers_text"][i] +"</input><br>";   
        }
        else if (q["answer_type"] == "options_multiple") {
            answer_radio_html += "<input type='checkbox' id='preliminary_question_" + q["code"] + "_" + q["answers_value"][i] + "'" + (already_answered && preliminary_questions_answers[pi][i] ? " checked " : "") + ">" + " " + q["answers_text"][i] +"</input><br>";
        }
    }
    
    answer_radio.innerHTML = answer_radio_html;
}

function submitPreliminaryQuestion() {
    var alert_condition = true;
    var qs_value;
    if (current_preliminary_question_index == 0) {
        qsv =[];
        for (i in  preliminary_questions[current_preliminary_question_index]["answers_value"]) {
            // var qsi = document.querySelector('input[name="preliminary_question_' + preliminary_questions[current_preliminary_question_index]["code"] + "_" + preliminary_questions[current_preliminary_question_index]["answers_value"][i] + '"]:checked');
            var qsi = document.getElementById('preliminary_question_' + preliminary_questions[current_preliminary_question_index]["code"] + "_" + preliminary_questions[current_preliminary_question_index]["answers_value"][i] );
            if (qsi != null && qsi.checked == true ) {
                alert_condition = false;
                qsv.push(true);
            } else 
            qsv.push(false);
        }
        qs_value =qsv;
    } else if (current_preliminary_question_index == 1) {
        qs = document.querySelector('input[name="preliminary_question_' + preliminary_questions[current_preliminary_question_index]["code"] + '"]:checked');
        alert_condition = (qs == null);
        if (!alert_condition) {
            switch (qs.value) {
                case "s1":
                    qs_value = [true, false, false, false, false];
                    break;
                case "s2":
                    qs_value = [false, true, false, false, false];
                    break;
                case "s3":
                    qs_value = [false, false, true, false, false];
                    break;
                case "s4":
                    qs_value = [false, false, false, true, false];
                    break;
                case "s5":
                    qs_value = [false, false, false, false, true];
                    break;
            }
        }
    }

    if (alert_condition) {
        if ( current_preliminary_question_index == 0)
            alert(please_select_one_or_more);
        else if ( current_preliminary_question_index == 1)
            alert(please_select_one);
    }
    else {
        preliminary_questions_answers[current_preliminary_question_index] = qs_value;
        if ( current_preliminary_question_index == 0) {
            m = qs_value[0];
            t = qs_value[1];
            o = qs_value[2];
            d = qs_value[3];
        }
        else if ( current_preliminary_question_index == 1) {
            s1 = qs_value[0];
            s2 = qs_value[1];
            s3 = qs_value[2];
            s4 = qs_value[3];
            s5 = qs_value[4];
        }
       
        // save values
        preliminary_questions_progress++;
        saveToLocalStorage();
        updateSettingsTable();
        if (preliminary_questions_progress < 2) {
            current_preliminary_question_index++;
            loadPreliminaryQuestion(current_preliminary_question_index);
        } else {
            loadTopicSelection();
        }
    }
}
function loadTopicSelection() {
    current_preliminary_question = preliminary_questions[i];
    change_settings_progress = 2;
    saveTopicSelectionToLocalStorage();
    document.getElementById("topic_selection_text").innerHTML = topic_selection_text_string;
    buildTopicSelectionDropdown(topics_texts, topics_values);
    hideAllDivsAndShowOnly("topic_selection_box");
}

function buildTopicSelectionDropdown(topics_texts, topics_values) {
    var topic_list = document.getElementById("topic_selection_list");
    removeChildren(topic_list);
    var topic_list_html ="";
    topic_list_html = '<div class="dropdown "><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Select</button><div class="dropdown-menu dropdown-menu-topic" aria-labelledby="dropdownMenuButton">';
    // topic_list.className = "dropdown";
    var dropdown_button = document.createElement("button");
    dropdown_button.className = "btn btn-light dropdown-toggle";
    dropdown_button.setAttribute("id", "topic_list_dropdown_button");
    dropdown_button.setAttribute("type", "button");
    dropdown_button.setAttribute("data-toggle", "dropdown");
    dropdown_button.setAttribute("aria-haspopup", "true");
    dropdown_button.setAttribute("aria-expanded", "false");
    dropdown_button.innerHTML = topics_texts[0]; 
    current_topic_selected = topics_values[0];
    topic_list.appendChild(dropdown_button);
    var dropdown_menu = document.createElement("div");
    dropdown_menu.setAttribute("aria-labelledby", "dropdownMenuButton");
    dropdown_menu.className = "dropdown-menu";
    for (var i in topics_texts) {
        var b = document.createElement('a');
        b.className = "dropdown-item";
        b.setAttribute("href","#");
        b.innerHTML = topics_texts[i];
        b.setAttribute("topic_value",topics_values[i]);
        b.onclick = function() { onTopicSelectedDropdown(this.getAttribute("topic_value")) };
        dropdown_menu.appendChild(b);
        //topic_list.appendChild(document.createElement('br'));
        topic_list_html += "<a class=\"dropdown-item\" href=\"#\">" + topics_texts[i] + "</a>";
    }
    topic_list.appendChild(dropdown_menu);
    topic_list_html += "</div></div>";
    
}

function buildTopicSelectionList(topics_texts, topics_values) {
    var topic_list = document.getElementById("topic_selection_list");
    removeChildren(topic_list);
    var topic_list_html ="";
    for (var i in topics_texts) {
        var b = document.createElement('button');
        b.innerHTML = topics_texts[i];
        b.setAttribute("topic_value",topics_values[i]);
        b.onclick = function() { onTopicSelected(this.getAttribute("topic_value")) };
        topic_list.appendChild(b);
        topic_list.appendChild(document.createElement('br'));
    }
}

function onTopicSelected(v) {
    goToTopic(v);
}

function onTopicSelectedDropdown(v) {
    current_topic_selected = v;
    document.getElementById("topic_list_dropdown_button").innerHTML = topics_texts[getTopicIndex(v)];
}

function SubmitTopicSelectedDropdown() {
    goToTopic(current_topic_selected);   
}

function goToTopic(t) {
    var q = getTopicFirstQuestion(t, false);
    if ( q == null )
        alert(no_question_in_this_topic);
    else {
        goToQuestion(q);
    }

}

function goToQuestion(i) {

    q = questions[i];
    a = questions_array[i];

    current_question = i;

    var topic = document.getElementById("question_topic_text");
    topic.innerHTML = getTopicName(q["topic"]);
    var code = document.getElementById("question_code_text");
    code.innerHTML = q["cardcode"];
    var text = document.getElementById("question_text_text");
    text.innerHTML = q["text"];

    document.getElementById("question_card").style.borderColor = getTopicColor(q["topic"]);

    emptyAnswersFields();

    let radio = document.getElementById("question_answer_binary");
    let open = document.getElementById("question_answer_open");
    let open_large = document.getElementById("question_answer_text");
    let open_small = document.getElementById("question_answer_text_small");
    let multiple_radio = document.getElementById("question_answer_multiple");
    let sep  = document.getElementById("question_answer_both_separator");

    
    // show pertinent fields
    radio.style.display= "none";
    multiple_radio.style.display= "none";
    open.style.display= "none";   
    sep.style.display= "none";

    if ( q["type"].includes("binary") ) {
        radio.style.display= "block";
    } 
    if ( q["type"].includes("options") ){
        buildMultipleRadioButtons("question_answer_multiple", q["options"]);
        multiple_radio.style.display= "block";
    }
    if ( q["type"].includes("open") ) {
        open.style.display= "block";   
    }
    
    // separator 
    if (  ( (q["type"].includes("binary")) || (q["type"].includes("options")) )  && (q["type"].includes("open")) ) {
        sep.style.display= "block";        
        open_small.style.display= "block";
        question_answer_text="question_answer_text_small";
        open_large.style.display= "none";
        
    } else {
        open_small.style.display= "none";
        question_answer_text="question_answer_text"
        open_large.style.display= "block";
    }


    // load linked questions
    // buildLinkedQuestionsButtons(q);
    buildLinkedQuestionsCards(q);
    
    

    // check if it is already answered
    loadCurrentQuestionAnswer();

    hideAllDivsAndShowOnly("questions_box");   

    // update progress bars
    updateProgressBars();

    saveCurrentQuestionToLocalStorage();
}

function loadCurrentQuestionAnswer() {
    var q = questions[current_question];
    var a = questions_array[current_question];
    var answers = a["answers"];
    var already_answered = (a["answered"] || a["viewed"]) && (answers!= null) && (answers!= []) ;

    var cancel_button = document.getElementById("cancel_button");

    if (already_answered) {
        let radio_yes = document.getElementById("question_answer_radio_yes");
        let radio_no = document.getElementById("question_answer_radio_no");
        let text = document.getElementById(question_answer_text);
        
        // show pertinent fields
        if ( ( q["type"].includes("binary") ) && ( q["type"].includes("open") ) ) {
            radio_yes.checked = (answers[0] == "Yes");
            radio_no.checked = (answers[0] == "No");
            var text_to_load = answers[1];
            text.value = (text_to_load!=null ? text_to_load : "");
        } else if ( q["type"].includes("binary") ) {
            radio_yes.checked = (answers[0] == "Yes");
            radio_no.checked = (answers[0] == "No");        
        } else if ( q["type"].includes("open") ) {
            text.value = answers[0];
        } else if ( q["type"].includes("options") ) {
            for (i in q["options"]) {
                var radio = document.getElementById("question_answer_multiple_radio"+"_"+i);
                var radio_value = radio.value;
                if ( answers[0] == radio.value ) 
                    radio.checked = true;
                else 
                    radio.checked = false;
            }
        }        
        // cancel_button.style.display = "inline";

    } else {
        // cancel_button.style.display = "none";
    }

    //load comment, too
    if (a["comment"] !=null) {
        let comment = document.getElementById("question_comment_text");
        comment.value = a["comment"];
    }

    if (a["answered"]) {
        document.getElementById("resolved_button").className = "btn btn-success question_button ";
        document.getElementById("forreview_button").className = "btn btn-secondary question_button";
    } else if (a["viewed"]) {
        document.getElementById("resolved_button").className = "btn btn-secondary question_button";
        document.getElementById("forreview_button").className = "btn btn-warning question_button";
    } else {
        document.getElementById("resolved_button").className = "btn btn-secondary question_button";
        document.getElementById("forreview_button").className = "btn btn-secondary question_button";
    }

    document.getElementById("resolved_button").style.fontSize = "1.0vw";
    document.getElementById("forreview_button").style.fontSize = "1.0vw";
    document.getElementById("next_button").style.fontSize = "1.0vw";

    if ( a["answered"] || a["viewed"] )  {
        document.getElementById("next_button").disabled = false;
    } else {
        document.getElementById("next_button").disabled = true;
    }


}

function emptyAnswersFields() {
    let radio_yes = document.getElementById("question_answer_radio_yes");
    let radio_no = document.getElementById("question_answer_radio_no");
    let text = document.getElementById("question_answer_text");
    let text_small = document.getElementById("question_answer_text_small");
    let multiple_radio = document.getElementById("question_answer_multiple");
    let comment = document.getElementById("question_comment_text");
    radio_yes.checked = false;
    radio_no.checked = false;
    text.value ="";
    text_small.value ="";
    removeChildren(multiple_radio);
    comment.value="";
}

function createQuestionsArray() {
    questions_array =[];
    questions_map = {};
    for (i in questions) {
        var qi = questions[i];
        qa = {"code": qi["code"], "answered": false, answers: [], "viewed":false };
        questions_array.push(qa);
        var qm = {};
        var codemember = qi["code"];
        qm[codemember]=parseInt(i, 10);
        questions_map[codemember]=parseInt(i, 10);
    }
    
}


function buildProgressDiv() {
    var d0 = document.getElementById("questions_progress");
    removeChildren(d0);
    var table0 = document.createElement("table");
    table0.classList.add("table");
    d0.appendChild(table0);
    // if (isAndroid)
    //     table0.style.fontSize = "0.7vw"
    var tr0 = document.createElement("tr");
    var td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Topics"));
    td00.style.width = "16vw"
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode(""));
    td00.style.width = "64vw"
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    tr0.appendChild(td00);
    td00.appendChild(document.createTextNode("Progress"));
    td00.classList.add("borderless-cell");
    td00.setAttribute("colspan", 9);
    td00.style.width = "16vw"
    addTdSpace(tr0, 1);
    tr0.appendChild(td00);
    //td00.style.width = "80%";
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Answered"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Read"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Not read"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("All available"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Not available"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    td00 = document.createElement("td");
    td00.appendChild(document.createTextNode("Not applicable"));
    td00.style.display = "none";
    tr0.appendChild(td00);
    tr0.style.fontWeight = "bold";
    table0.appendChild(tr0);
    
    var tr1 = document.createElement("tr");
    var td10 = document.createElement("td");
    td10.appendChild(document.createTextNode("Overall: "));
    //td10.setAttribute("style", "white-space:nowrap;");
    tr1.appendChild(td10);
    var td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_bar");
    td11.setAttribute("style", "white-space:nowrap;");
    // td11.style.width = "70%"
    tr1.appendChild(td11);
    if (hide_overall_bar) {
        td11.style.display = "none";
        td11 = document.createElement("td");
    }
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_answered");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_viewed");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_notviewed");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_allavailable");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_notavailable");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    td11 = document.createElement("td");
    td11.setAttribute("id", "questions_progress_" + "overall" +"_notapplicable");
    td11.setAttribute("style", "white-space:nowrap;");
    td11.style.display = "none";
    tr1.appendChild(td11);
    if (hide_overall)
        tr1.style.display = "none";
    tr1.style.fontWeight = "bold";
    table0.appendChild(tr1);

    for (i in topics_texts) {
        var tr1 = document.createElement("tr");
        var td11 = document.createElement("td");
        var td11span = document.createElement("div");
        td11span.appendChild(document.createTextNode(topics_texts[i]));
        td11.appendChild(td11span);
        td11.setAttribute("topic",  topics_values[i]);
        td11.onclick = function() { goToTopic(this.getAttribute("topic")) };
        td11span.style.background = topics_hex[i];
        td11span.classList.add("rounded"); 
        td11span.classList.add("settings_button"); 
        td11span.classList.add("nav-bar-border");
        //td11span.classList.add("col");
        td11span.classList.add("bg");
        td11span.classList.add("nav-bar-topic"); 
        td11.style.verticalAlign = "middle";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_bar");
        td11.setAttribute("style", "white-space:nowrap;");
        //td11.style.width="78%";
        tr1.appendChild(td11);
        if (i==0) {
            var td11 = document.createElement("td");
            td11.setAttribute("rowspan", 8);         
            td11.style.width = "3vw";
            td11.classList.add("borderless-cell");
            //td11.innerHTML = ""; "<span style='opacity:0; font-size: 0.7vw'>__________</span>"
            var bars = ["progress_bar_resolved", "progress_bar_viewed", "progress_bar_notviewed" ];
            for (j in bars) {
                
                addTdSpace(tr1, 8);
                var td  = td11.cloneNode(true);
                td.setAttribute("id", bars[j]);
                tr1.appendChild(td);
                addTdSpace(tr1, 8);
                
            }

            
        }
        if (i==8) {
            for (j in bars) {
                // if (j==0)
                //     addTdSpace(tr1,2);
                var td  = document.createElement("td");
                td.style.textAlign = "center";
                td.setAttribute("rowspan", 2);
                td.setAttribute("colspan", 3);
                td.appendChild(document.createTextNode(bartitles[j]));
                td.style.verticalAlign= "middle";
                td.setAttribute("id", bartitles[j]+"_title_perc");
                td.className="borderless-cell";
                td.classList.add("bar_titles");
                tr1.appendChild(td);
                
            }
        }
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_answered");
        td11.style.display = "none";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_viewed");
        td11.style.display = "none";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_notviewed");
        td11.style.display = "none";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_allavailable");
        td11.style.display = "none";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_notavailable");
        td11.style.display = "none";
        tr1.appendChild(td11);
        var td11 = document.createElement("td");
        td11.setAttribute("id", "questions_progress_" + topics_values[i] +"_notapplicable");
        td11.style.display = "none";
        tr1.appendChild(td11);
        table0.appendChild(tr1);    
    }

    //table0.style.width="100%";
}

function updateSettingsTable() {
    var who_settings = document.getElementById("question_settings_who");
    who_settings.innerHTML = getSettingsString(0);
    var stage_settings = document.getElementById("question_settings_stage");
    stage_settings.innerHTML = getSettingsString(1);
}


function getSettingsString(index) {
    var s = "";
    for (i in preliminary_questions_answers[index]) {
        if (preliminary_questions_answers[index][i]) {
            if (s != "" )
                s += ", "
            s += preliminary_questions[index]["answers_text"][i];
        }
    }
    return s;
}


function submitQuestion() {
    // save current question answer
    var q = questions_array[current_question];
    var a = getCurrentQuestionAnwers();
    if ( a == null ) {
        alert(please_insert);
    }
    else {
        var c = getCurrentComment();
        setQuestionAnswer(q, a, c);
        saveQuestionsArrayToLocalStorage();
        goToCurrentQuestion();
        
    }

}

function submitQuestionForreview() {
    // save current question answer
    var q = questions_array[current_question];
    var a = getCurrentQuestionAnwers();
    console.log(a);
    var c = getCurrentComment();
    setQuestionForreview(q, a, c);
    saveQuestionsArrayToLocalStorage();
    goToCurrentQuestion();

}

function goToNextQuestion() {
    goToFollowingQuestion(true, false, reached_end_of_questionnaire);
}

function goToNextUnansweredQuestion() {
    goToFollowingQuestion(true, true, reached_end_of_questionnaire);
}


function goToPreviousQuestion() {
    goToFollowingQuestion(false, false, reached_end_of_questionnaire);
}

function goToPreviousUnansweredQuestion() {
    goToFollowingQuestion(false, true, reached_end_of_questionnaire);
}

function goToFollowingQuestion(forward, unanswered, error_message) {
    var next_question = getFollowingQuestion(forward, unanswered);
    if (next_question != null ) {
        current_question=next_question;
        saveCurrentQuestionToLocalStorage();
        goToQuestion(current_question);
    } else 
        alert(error_message);
}

function getFollowingQuestion(forward, unanswered) {
    var next_question = current_question;
    while (true) {
        if ( forward )
            next_question++;
        else
            next_question--;
        if ( (next_question < questions.length) && (next_question > -1) ) {
            if ( checkStage(next_question) )
                if ( checkRole(next_question) )
                    if ( checkDependencies(next_question) )
                        if ( !unanswered || checkIfUnanswered(next_question) )
                            return next_question;
        } else 
            return null;
    }
}

function getTopicFirstQuestion(topic, notviewed) {
    var next_question = 0;
    while (true) {
        if ( (next_question < questions.length) && (next_question > -1) ) {
            if ( checkStage(next_question) )
                if ( checkRole(next_question) )
                    if ( checkDependencies(next_question) )
                        if ( checkTopic(next_question, topic) )
                            if ( !notviewed || checkIfNotviewed(next_question) )
                                return next_question;
        } else 
            return null;

        next_question++;    
    }
}

function getTopicFirstUnansweredQuestion(topic, notviewed) {
    var next_question = 0;
    while (true) {
        if ( (next_question < questions.length) && (next_question > -1) ) {
            if ( checkStage(next_question) )
                if ( checkRole(next_question) )
                    if ( checkDependencies(next_question) )
                        if ( checkTopic(next_question, topic) )
                            if ( !notviewed || checkIfNotviewed(next_question) )
                                if (!questions_array[next_question]["answered"] && !questions_array[next_question]["viewed"])
                                    return next_question;
        } else 
            return null;

        next_question++;    
    }
}

function checkTopic( n, t) {
    if ( questions[n]["topic"]==t)
        return true;
    else 
        return false;
}

function checkRole(i) {
    q = questions[i];
    return ( (q["m"] && m) || (q["t"] && t) || (q["o"] && o) || (q["d"] && d) ) ;
}

function checkStage(i) {
    q = questions[i];
    if ( q == null )
        console.log(i);
    return ( (q["s1"] && s1) || (q["s2"] && s2) || (q["s3"] && s3) || (q["s4"] && s4) || (q["s5"] && s5) ) ;
}

function checkIfUnanswered(i) {
    return !(questions_array[i]["answered"]);
}

function checkIfNotviewed(i) {
    return !(questions_array[i]["viewed"]);
}

function checkDependencies(i) {
    var checked = false;
    var child = questions[i];
    var dependencies = child["dependencies"];
    var values = child["dependencies_values"];
    var logic = child["dependencies_logic"];


    // chceck if no dependencies
    if ( (dependencies == null) || ( dependencies.length == 0 ) )
        return true;
    
    // check dependencies
    if (logic == "AND")
        checked = true;
    else
        checked = false;
    for (d in dependencies) {
        var parent = questions_array[questions_map[dependencies[d]]];
        // check values, not only if answered
        var val = null;
        if ( parent == null) {
            console.log(child["code"]);
            console.log(dependencies);
            break;
        }


        val = 
             ( ( parent["viewed"] || parent["answered"] ) &&  (values[d]=="Answered") ) ||
             ( ( parent["viewed"] || parent["answered"] ) && (parent["answers"] != null) && (parent["answers"] != []) && ( parent["answers"][0] == values[d] ) )
             ;
           
        if (logic == "AND")
            checked = checked && val;
        else 
            checked = checked || val;
    }
    return checked;
}

function setQuestionForreview(q, a, c) {
    q["answered"]=false;
    q["viewed"]=true;
    q["answers"]=a;
    q["comment"]=c;


}

function setQuestionAnswer(q, a, c) {
    q["answered"]=true;
    q["answers"]=a;
    q["comment"]=c;

}

function unsetQuestionAnswer(q, a, c) {
    q["answered"]=false;
    q["answers"]=[];
    q["comment"]=null;

}

function cancelQuestionAnswer(q) {
    q["answered"] = false;
    q["answers"] = [];
    q["comment"] = null;
}

function getCurrentQuestionAnwers(){
    var q = questions[current_question];
    var answers = [];
    var answer_radio;
    var answer_text;

    if (q["type"].includes("binary")) {
        answer_radio = document.querySelector('input[name="question_answer_radio"]:checked');
        if ( answer_radio != null) {
            answers.push(answer_radio.value);
        }
    }
    if (q["type"].includes("open")) {
        answer_text = document.getElementById(question_answer_text).value;
        if ((answer_text!=null) && (answer_text!=undefined) && (answer_text!="") ) {
            answers.push(answer_text);
        }
    }
    if (q["type"].includes("options")) {
        answer_radio = document.querySelector('input[name="question_answer_multiple_radio"]:checked');
        if ( answer_radio != null) {
            answers.push(answer_radio.value);   
        }
    }

    if (answers[0] == null)
        return null;
    else {
        return answers;
    }

}

function getCurrentComment() {
    var comment = document.getElementById("question_comment_text").value;
    return comment;
}


function incrementQuestion(i) {
    if ( i+1 < questions_array.length )
        return i+1;
    else
        return 0;

}

function arrayOfZeros(d) {
    var a = [];
    for (var i=0;i<d;i++)
        a.push(0);
    return a;
}

function arrayOfEmptyArrays(d) {
    var a = [];
    for (var i=0;i<d;i++)
        a.push([]);
    return a;
}

function arrayOfEmptyStrings(d) {
    var a = [];
    for (var i=0;i<d;i++)
        a.push("");
    return a;
}

function getTopicIndexIncludingOverall(t){
    for (var i in topics_values)
        if ( topics_values[i] == t )
            return ++i;
}

function getTopicIndex(t){
    for (var i=0;i <  topics_values.length;i++)
        if ( topics_values[i] == t )
            return i;
}


function updateProgressBars() {
    
    var dim = topics_values.length +1;
    var questions_count = arrayOfZeros(dim);
    var answered_count = arrayOfZeros(dim);
    var viewed_count = arrayOfZeros(dim);
    var notviewed_count = arrayOfZeros(dim);
    var notavailable_count = arrayOfZeros(dim);
    var notapplicable_count = arrayOfZeros(dim);
    var questions_states_arrays = arrayOfEmptyArrays(dim);
    var s =arrayOfEmptyStrings(dim);
    for ( i in questions_array ) {
        var i_topic = getTopicIndexIncludingOverall(questions[i]["topic"]);
        // console.log("i_topic: " + i_topic);
        var si = "✓";
              
        var a = questions_array[i];
        var notyetavailable = (checkDependencies(i) == null) ;
        var notapplicable = (checkDependencies(i) == false) ;
        var notrole = !checkRole(i);
        var notstage = !checkStage(i);
        var notavailable = (notrole || notstage);
        var viewed = a["viewed"];
        var answered  = a["answered"];
        var available = !notyetavailable && !notavailable && !notapplicable;
        
        var color = green;
        var textcolor = green;
        var bordercolor = white;;
        var state = "";
        if ( notavailable) {
            si = makeLightgray(si);
            notavailable_count[0]++;
            notavailable_count[i_topic]++;
            color = lightgray;
            state = "notavailable";
        }
        else if ( notyetavailable || notapplicable ) {
            si = makeGray(si);
            notapplicable_count[0]++;
            notapplicable_count[i_topic]++;
            color = gray;
            state = "notapplicable";
        }
        else if ( viewed && !answered) {
            si = makeYellow(si);
            viewed_count[0]++;
            viewed_count[i_topic]++;
            color = yellow;
            state = "viewed";
        }
        else if ( answered ) {
            si = makeGreen(si);
            answered_count[0]++;
            answered_count[i_topic]++;
            color = green;
            state = "answered";
        }
        else {
            si = makeRed(si);
            notviewed_count[0]++;
            notviewed_count[i_topic]++;
            color = red;
            state = "notviewed";
        }

        if (current_question == i ) {
            bordercolor = white;
            textcolor = white;
            color = color;
        } else {
            textcolor = color;
        }
        
        si = makeBold(si);
            si = "<div class='nav-bar-border col bg -" + color + " text-" + textcolor + 
                   (isAndroid? " paddinglrsmallandroid  ": " paddinglrsmall " ) + 
                   "border border-" + bordercolor + " rounded" 
                 + "'" + 
                 " style ='color:" + textcolor + ";" + "background-color:" + getHex(color) + ";"+ " width:100%;" +  "'" + 
                 ">" +si+"</div>";

        // make span and attach onclick and hint
        var first_unanswered_in_topic = (i == getTopicFirstUnansweredQuestion(questions[i]["topic"], true ) );
        si = makeSpanWithOnclickAndHint(si, i, viewed || answered || first_unanswered_in_topic, state);

        s[0] += si;
        s[i_topic] += si;
        
    }
    for (var j=0; j<dim; j++) {
        s[j] = 
                "<div class='row style='width: 100%'>" +s[j]+ "</div>" 
               
                ;
    }
        
    

    for (var j=0; j<dim; j++) {
        var topic_suffix = "t" + j;
        if (j == 0) {
            topic_suffix = "overall";
        }
        var total = answered_count[j] + viewed_count[j] + notviewed_count[j];
        var td_bar = document.getElementById("questions_progress_" + topic_suffix + "_bar");
        var td_answered = document.getElementById("questions_progress_" + topic_suffix + "_answered");
        var td_viewed = document.getElementById("questions_progress_" + topic_suffix + "_viewed");
        var td_notviewed = document.getElementById("questions_progress_" + topic_suffix + "_notviewed")
        var td_allavailable = document.getElementById("questions_progress_" + topic_suffix + "_allavailable");
        var td_notavailable = document.getElementById("questions_progress_" + topic_suffix + "_notavailable")
        var td_notapplicable = document.getElementById("questions_progress_" + topic_suffix + "_notapplicable");
        
        td_bar.innerHTML =  s[j];
        td_bar.parentNode.classList.add("flex-fill");
        td_bar.parentNode.parentNode.classList.add("flex-fill");
        td_answered.innerHTML = getBarPercentage(answered_count[j], total);
        td_viewed.innerHTML = getBarPercentage(viewed_count[j], total);
        td_notviewed.innerHTML = getBarPercentage(notviewed_count[j], total);
        td_allavailable.innerHTML = getCountOnly(total, total);
        td_notavailable.innerHTML = getCountOnly(notavailable_count[j], total);
        td_notapplicable.innerHTML = getCountOnly(notapplicable_count[j], total);

        td_answered.style.background = "linear-gradient(to right, " + green +  " " + getPercentageOnly(answered_count[j], total) + "%" + " , transparent 0)";
        td_viewed.style.background = "linear-gradient(to right, " + yellow +  " " + getPercentageOnly(viewed_count[j], total) + "%" + " , transparent 0)";
        td_notviewed.style.background = "linear-gradient(to right, " + red +  " " + getPercentageOnly(notviewed_count[j], total) + "%" + " , transparent 0)";
        td_allavailable.style.background = "linear-gradient(to right, " + white +  " " + "100" + "%" + " , transparent 0)";
        td_notavailable.style.background = "linear-gradient(to right, " + lightgray +  " " + "100" + "%" + " , transparent 0)";
        td_notapplicable.style.background = "linear-gradient(to right, " + gray +  " " + "100" + "%" + " , transparent 0)";

        
    }
    var bars = ["progress_bar_resolved", "progress_bar_viewed", "progress_bar_notviewed" ];
    var colors = [greenhex, yellowhex, redhex];
    var values = [ answered_count[0], viewed_count[0], notviewed_count[0]]
    var percs = getRoundedPercentages(values);
    total = values.reduce((a, b) => a + b, 0);
    for (j in bars) {
        var bar = document.getElementById(bars[j]);
        bar.style.background = "linear-gradient(to top," + colors[j] +" " + percs[j] +"%" +", transparent 0)";
        var title_perc = document.getElementById(bartitles[j] + "_title_perc");
        title_perc.innerHTML = bartitles[j] + "<br>" + percs[j] +"%" ;
    }
}
function makeSpanWithOnclickAndHint(si, i, available, state) { 
    
    var error_message = please_follow_sequence_and_restart_from_first_ananswered;
    if (state == "notapplicable")
        var error_message = this_question_is_not_available_previous_answers;
    else if (state == "notavailable")
        var error_message = this_question_is_not_available_role_stage;
    else if (!available && state == "notviewed")
        var error_message = please_follow_sequence_and_restart_from_first_ananswered;

    return "<span"          + " title=\"" 
                            // +  questions[i]["cardcode"] 
                            + ( available ?  "\n"  + questions[i]["text"] + "\"" : error_message  + "\"" )
                            + ( available ? " onclick=\"" + "goToQuestion(" + i +")" + "\"" + "style=\"cursor: pointer\"" : " onclick=\"" + "alert('" + error_message + "')\"" + "style=\"cursor: pointer\"" )

                            + " >" + si + "</span>";
}

function makeGray(s) {
    return makeColor(gray, s);
}
function makeLightgray(s) {
    return makeColor(lightgray, s);
}
function makeGreen(s) {
    return makeColor(green, s);
}
function makeYellow(s) {
    return makeColor(yellow, s);
}
function makeRed(s) {
    return makeColor(red, s);
}
function makeColor(color, s) {
    return "<span style=\"background-color:" + color + "\">" + s + "</span>";
}

function makeBold (s) {
    return "<span style=\"font-weight:bold\">" + s + "</span>"
}

function makeH(h, s) {
    return "<" + h + ">" + s + "</" + h + ">";
}

function getBarPercentage(count, total) {
    var perc =  Math.round(count/total*100);
    if ( isNaN(perc) )
        return count;
    else
        return count + " " + "(" + perc + "%)";
}

function getPercentageOnly(count, total) {
    var perc =  Math.round(count/total*100);
    if ( isNaN(perc) )
        return 0;
    else
        return perc;
}

function getCountOnly(count, total) {
    return count;
}

function buildMultipleRadioButtons(parent_id, options) {
    const radio_name = "question_answer_multiple_radio";
    var parent = document.getElementById(parent_id);
    removeChildren(parent);
    multiple_radio_html = "";
    for ( o in options ) {
        multiple_radio_html += "<input type='radio' class='radio-button' value='" + firstToUpperCase(options[o]) +"' "+ "name='" + radio_name + "' " + "id='" + radio_name + "_" + o + "' > " + firstToUpperCase(options[o]) +"</input><br>";   
        parent.innerHTML = multiple_radio_html;
        }
}

function firstToUpperCase(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
}

function getTopicName(t) {
    var topic_name = "";
    for (i  in topics_values )
        if ( topics_values[i] == t )
            topic_name = topics_texts[i];
        return topic_name;
}

function getTopicColor(t) {
    var topic_hex = topics_hex[0];
    for (i  in topics_values )
        if ( topics_values[i] == t )
            topic_hex = topics_hex[i];
        return topic_hex;
}

function saveToLocalStorage() {
    savePreliminaryQuestionsToLocalStorage();
    if (preliminary_questions_progress >= 2) {
        saveQuestionsArrayToLocalStorage();
        saveCurrentQuestionToLocalStorage();
        saveTopicSelectionToLocalStorage();
    }

}


function savePreliminaryQuestionsToLocalStorage() {
    if (preliminary_questions_progress >= 0) {
       localStorage.setItem("preliminary_questions_progress", preliminary_questions_progress);
    }
    if (preliminary_questions_progress >= 1) {
        localStorage.setItem("preliminary_questions_answers", JSON.stringify(preliminary_questions_answers));
    }
}

function saveQuestionsArrayToLocalStorage() {
    localStorage.setItem("questions_array", JSON.stringify(questions_array));
}

function saveCurrentQuestionToLocalStorage() {
    localStorage.setItem("current_question", current_question);
}

function saveTopicSelectionToLocalStorage() {
    localStorage.setItem("change_settings_progress", 2);
}
function loadFromLocalStorage() {

    var preliminary_questions_progress_stored = localStorage.getItem("preliminary_questions_progress");
    

    if ( preliminary_questions_progress_stored != null  ) {
        
        if (current_preliminary_question_index == 0) {
           preliminary_questions_progress = preliminary_questions_progress_stored;
           current_preliminary_question_index = 0;
           // loadPreliminaryQuestion(0);
        }
        if (preliminary_questions_progress >= 1) {
            var preliminary_questions_answers_stored = localStorage.getItem("preliminary_questions_answers");
            if ( preliminary_questions_answers_stored != null ) {
                preliminary_questions_answers = JSON.parse(preliminary_questions_answers_stored);
                loadRolesAndStagesFromPreliminaryQuestions();
                current_preliminary_question_index = 1;
                
            }
                        
        }
        if (preliminary_questions_progress >= 2) {
            var preliminary_questions_answers_stored = localStorage.getItem("preliminary_questions_answers");
            if ( preliminary_questions_answers_stored != null ) {
                preliminary_questions_answers = JSON.parse(preliminary_questions_answers_stored);
                loadStagesFromPreliminaryQuestions();
            } 
            var questions_array_stored = localStorage.getItem("questions_array");
            if ( questions_array_stored != null )  {
                questions_array = JSON.parse(questions_array_stored);
                current_question_stored = localStorage.getItem("current_question");              
                if ( current_question_stored != null )  {
                    current_question = current_question_stored;
                }
                else current_question = 0;
                change_settings_progress_stored = localStorage.getItem("change_settings_progress");              
                if ( change_settings_progress_stored != null )  {
                    change_settings_progress = change_settings_progress_stored;
                }                
            }
        }


    }

}


function resetLocalStorage() {
    localStorage.removeItem("preliminary_questions_progress", preliminary_questions_progress);
    localStorage.removeItem("preliminary_questions_answers", preliminary_questions_answers);
    localStorage.removeItem("questions_array", JSON.stringify(questions_array));
    localStorage.removeItem("current_question", current_question);
}


function resetAnswers() {   
    if (confirm(will_delete_answers_and_comments)) {
        localStorage.removeItem("questions_array", JSON.stringify(questions_array));
        localStorage.removeItem("current_question", current_question);   
        init();    
    }
}

function resetSettingsAndAnswers() {
    if (confirm(will_delete_answers_and_comments)) {
        resetLocalStorage();
        init();
    }
}

function loadRolesAndStagesFromPreliminaryQuestions() {
    loadRolesFromPreliminaryQuestions();
    loadStagesFromPreliminaryQuestions();
    updateSettingsTable();

}

function loadRolesFromPreliminaryQuestions() {
    var s = preliminary_questions_answers[0];
    if ( (s != null)  && (s != []) ) {                
            m = s[0];
            t = s[1];
            o = s[2];
            d = s[3];
    }
}

function loadStagesFromPreliminaryQuestions() {
    var s = preliminary_questions_answers[1];
    if ( (s != null)  && (s != []) ) {
            s1 = s[0];
            s2 = s[1];
            s3 = s[2];
            s4 = s[3];
            s5 = s[4];
    }    
}


function goToResetAnswers(){
    // add alert !!!
    resetAnswers();
}

function goToResetSettingsAndAnswers() {
    // add alert !!!
    resetSettingsAndAnswers();
}


function goToChangeSettings(){
    preliminary_questions_progress = 0;
    current_preliminary_question_index = 0;
    loadPreliminaryQuestion(0);
}

function goToChangeTopic(){
    loadTopicSelection();
}


function goToNextTopic() {
    goToFollowingTopic(true);
}

function goToPreviousTopic() {
    goToFollowingTopic(false);
}

function goToFollowingTopic(forward) {
    var curr_topic = questions[current_question]["topic"];
    var curr_topic_index = getTopicIndex(curr_topic);
    console.log(curr_topic_index);
    var next_topic_index = (forward ? curr_topic_index+1 : curr_topic_index-1); 
    console.log(next_topic_index);
    for (var j=next_topic_index; ( (j>=0) && (j<topics_values.length) ) ; ) {
        console.log(j);
        var q = getTopicFirstQuestion(topics_values[j], false);
        if ( q != null ) {
            goToQuestion(q);
            return;            
        } else 
            if (forward) j++; else j--;
    }
    alert(reached_end_of_questionnaire);

}

function buildLinkedQuestionsCards(q) {
    var linked_cards_div = document.getElementById("question_linked_cards");
    removeChildren(linked_cards_div);
    var cards_available = false;
    var linked_questions_intro = document.getElementById("question_linked_cards_intro").cloneNode();
    linked_questions_intro.appendChild(document.createTextNode("Linked questions"));
    linked_cards_div.appendChild(linked_questions_intro);
    // console.log(linked_cards_div.innerHTML);
    for (var j=0; j < q["linked_questions"].length; j++) {
        var linked_q_code = q["linked_questions"][j];
        var linked_q = questions_map[linked_q_code];
        try {
            if (!checkStageRole(linked_q))
                continue;
        } catch (err) { continue;}
        try {
            if (!checkDependencies(linked_q))
                continue;
        } catch (err) { continue;}
        var card1 = document.getElementById("small_card").cloneNode();
        var link1 = document.createElement("span");
        link1.appendChild(document.createTextNode(getFirstWords(questions[linked_q]["text"]))); 
        link1.title = questions[linked_q]["text"];
        card1.setAttribute("q_id", linked_q)
        card1.style.borderColor = getTopicColor(questions[linked_q]["topic"]);
        if (checkDependencies(linked_q)) {
            card1.onclick = function() { goToQuestion(this.getAttribute("q_id")) };
            //link1.style.textDecoration = "underline";
            link1.style.cursor="pointer";
        }
        else {
            card1.onclick = function() { alert(this_question_is_not_available_previous_answers) };
            link1.style.textDecoration = "none";
        }
        card1.appendChild(link1);
        card1.style.display ="block";
        linked_cards_div.appendChild(card1);
        cards_available = true;
    }
    if ( cards_available )
        linked_cards_div.style.display = "block";
    else 
        linked_cards_div.style.display = "none";
    
}

function buildLinkedQuestionsButtons(q) {
    var question_linked_questions_buttons = document.getElementById("question_linked_questions_buttons");
    removeChildren(question_linked_questions_buttons);
    var notfirst = false;
    for (var j=0; j < q["linked_questions"].length; j++) {
        var linked_q_code = q["linked_questions"][j];
        var linked_q = questions_map[linked_q_code];
        console.log(questions[linked_q]["text"]);
        try {
            if (!checkStageRoleDependencies(linked_q))
                continue;
        } catch (err) { continue;}


        var link1 = document.createElement("span");

        link1.appendChild(document.createTextNode(getFirstWords(questions[linked_q]["text"])));
        link1.setAttribute("lq_id", linked_q)
        link1.style.textDecoration = "underline";
        link1.style.cursor="pointer";
        link1.title = questions[linked_q]["text"];
        link1.onclick = function() { goToQuestion(this.getAttribute("lq_id")) };
        if (notfirst)
            question_linked_questions_buttons.appendChild(document.createElement("br"));
        question_linked_questions_buttons.appendChild(link1);
        notfirst=true;
    }
}


function checkStageRole(i) {
    return (checkStage(i) && checkRole(i));
}

function checkStageRoleDependencies(i) {
    return (checkStage(i) && checkRole(i) && checkDependencies(i));
}


function doRandomAction() {
    var rand = Math.random();
    if (rand > 0.95)
        goToNextTopic();
    else if (rand > 0.55 ) {
        submitQuestionForreview();
        goToNextQuestion();
    }
    else {
        selectRandomAnswerAndSubmit();
        goToNextQuestion();
    }
        
}


function selectRandomAnswerAndSubmit() {
    selectRandomAnswer();
    submitQuestion();
}


function cancelQuestion() {
    // cancel current question answer
    var q = questions_array[current_question];
    unsetQuestionAnswer(q);
    saveQuestionsArrayToLocalStorage();
    goToQuestion(current_question);     
}

function selectRandomAnswer() {
    var q = questions[current_question];
    var type = q["type"];
    var radio_array;
    var open_text;
    if ( type.includes("binary")) {
        radio_array = document.getElementsByName('question_answer_radio');
    } else if ( type.includes("options")) {
        radio_array = document.getElementsByName('question_answer_multiple_radio');
    }
    //console.log(radio_array);
    if ( type.includes("open")) {
        open_text = document.getElementById(question_answer_text);
        open_text.value = "Bla bla bla";
    }

    if ( (type.includes("binary")) || (type.includes("options")) ) {
        var rand = Math.floor (Math.random() * radio_array.length);
        radio_array[0].checked = true;
    }

}

function goToPrintToPdf(state) {
    if ( state == "all" || checkQuestionsToPrint(state) )
        printToPdf(state);
    else 
        alert(no_questions_to_print);
}

function checkQuestionsToPrint(state) {
    var questionToPrint = false;
    questions_array.forEach( function(a,i) {
        if (checkStageRoleDependencies(i) && checkState(a, state))
            questionToPrint = true;
    });
    return questionToPrint;
}

function printToPdf(state) {
    var doc = new jsPDF("p", "mm", "a4");
    var fontname = "helvetica";
    doc.setFont(fontname);
    console.log(doc.getFontList());
    doc.setFontSize(12);
    var pages_count = 1;
    var x = 20;
    var y = 20;
    var states = ["For review", "Resolved"];
    var states_codes = ["viewed", "answered"];
    var states_intro = ["Questions For Review", "Resolved Questions"];
    var no_questions_msg = ["No questions to review", "No questions resolved"];
    var question_found;
    for (k in states) {
        if (state != "all" && state != states_codes[k])
            continue;
        if ( k == 1 && state=="all")
            y+=30;
        if (y > 277 ) {
                doc.addPage();
                pages_count++;
                y = 20;
            }
        var state_intro = states_intro[k];
        doc.setFontSize(16);
        doc.setFontStyle("normal");
        doc.text(x, y, state_intro);
        y += 2 * 1;
        doc.line(x, y, 190, y);
        y += 20;
        var previous_topic = "";
        //removeChildren(questions_table);
        var rows =[];
        rows.push(["Question", "Current Answer", "Comments"]);
        question_found = true; 
        questions.forEach(function(q, i){
            var a = questions_array[i];
            if ( q["topic"]!=previous_topic) {
                if (!question_found && (q["topic"]!="t1")) {
                    doc.setFontSize(12);
                    doc.setFontStyle("normal");
                    if (y > 277 ) {
                        doc.addPage();
                        pages_count++;
                        y = 26;
                    }
                    doc.text(x, y, no_questions_msg[k]);
                    y += 6; 
                    y += 4;                    
                } else if (print_pdf_as_table && (q["topic"]!="t1")){
                    y = makeAutotable(doc, rows, y, pages_count );
                    rows =[];
                    rows.push(["Question", "Current Answer", "Comments"]);
                }
                question_found = false;
                previous_topic = q["topic"];
                y += 12;
                if (y > 277 ) {
                    doc.addPage();
                    pages_count++;
                    y = 26;
                }
                var topic_name = "Topic: " + getTopicName(q["topic"]);
                var color_hex = getTopicColor(q["topic"]);
                var rgb = getRgbFromHex(color_hex);
                try {
                    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
                } catch (err) { ;}
                doc.setFontSize(16);
                doc.setFontStyle("bold");
                var width = doc.getTextWidth(topic_name) + 0.5;
                doc.rect(x, y-6, width, 8, 'F');
                doc.text(x, y, topic_name);
                y += 8 * 1;
                y += 6;
            }
            if (checkStageRoleDependencies(i) && checkState(a, states_codes[k]) ) {
                var qa_state = "Not read";
                if ( a["answered"] )
                    qa_state = "Resolved";
                else if ( a["viewed"]) 
                    qa_state = "For review";
                question_found = true;
                doc.setFontSize(12);
                var qa_answers = ( (a["answered"] || a["viewed"]) && (a["answers"]!= null && a["answers"]!=[]) ?  "Current answer: " +  a["answers"][0] + "\n" : "No answer provided\n" ) ;
                var qa_answers_only = ( (a["answered"] || a["viewed"]) && (a["answers"]!= null && a["answers"]!=[]) ?  "" +  a["answers"][0]  : "No answer provided\n" ) ;
                doc.setFontStyle("italic");
                var split_qa_answers = doc.splitTextToSize(qa_answers, 170);
                
                var qa_intro = "Q. " + q["text"] + "\n";
                var qa_intro_only =  q["text"] ;
                // console.log(qa);
                doc.setFontStyle("bold");
                var split_qa_intro = doc.splitTextToSize(qa_intro, 170);

                var qa_comment = "";
                var qa_comment_only = "";
                if  ( (qa_answers != "No answer provided") && (a["answers"]!= null) && (a["answers"].length > 1) && (a["answers"][1]!=null))  {
                    qa_comment = "Comments: " + a["answers"][1] + "\n";
                    qa_comment_only = a["answers"][1];
                }
                doc.setFontStyle("italic");
                var split_qa_comment = doc.splitTextToSize(qa_comment, 170);
                
                doc.setFontStyle("normal");
                doc.setFontSize(12);
                var split_qa_answers_only = doc.splitTextToSize(qa_answers_only, 50);
                var split_qa_intro_only = doc.splitTextToSize(qa_intro_only, 50);
                var split_qa_comment_only = doc.splitTextToSize(qa_comment_only, 50);
                
                if (!print_pdf_as_table) {
                    doc.setFontSize(12);
                    doc.setFontStyle("bold");
                    if (y > 277 ) {
                        doc.addPage();
                        pages_count++;
                        y = 20;
                    }
                    doc.text(x, y, split_qa_intro );
                    y += 4 * split_qa_intro.length;

                    doc.setFontStyle("italic");
                    if (y > 277 ) {
                        doc.addPage();
                        pages_count++;
                        y = 20;
                    }
                    doc.text(x, y, split_qa_answers );
                    y += 4 * split_qa_answers.length;
                    
                    if (qa_comment != "") {
                        if (y > 277 ) {
                        doc.addPage();
                        pages_count++;
                        y = 20;
                        }
                        doc.text(x, y, split_qa_comment );
                        y += 4 * split_qa_comment.length;
                    }

                    y += 6;
                }

                rows.push([split_qa_intro_only.join("\n") , split_qa_answers_only.join("\n") , split_qa_comment_only.join("\n")]);
                

            }
        });
        if (!question_found ) {
            doc.setFontSize(12);
            doc.setFontStyle("normal");
            if (y > 277 ) {
                doc.addPage();
                pages_count++;
                y = 26;
            }
            doc.text(x, y, no_questions_msg[k]);
            y += 6; 
            y += 4;
        }
        else if (print_pdf_as_table ) {
            y = makeAutotable(doc, rows, y, pages_count );
            rows =[];
            rows.push(["Question", "Current Answer", "Comments"]);
        }
    }
    doc.save('trustlens.pdf');
}

function checkState(a, s) {
    if (s == "all")
        return a["viewed"] || a["answered"];
    else if ( s == "answered" && a["answered"])
        return true;
    else if ( s == "viewed" && (a["viewed"] && !a["answered"]) )
        return true;
    else
        return false;

}

function save() {
    goToSaveAnswers();
}

function goToSaveAnswers() {
    var json = {
        "preliminary_questions_answers": preliminary_questions_answers,
        "questions_array": questions_array
    }
    var jsonString = JSON.stringify(json);
    downloadAnswersAsJson(jsonString, 'truslens.txt', 'text/plain');
}

function downloadAnswersAsJson(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function load() {
    goToLoadAnswers();
}

function goToLoadAnswers() {
    document.getElementById('inputAnswersJson').click();    
}


function setInputAnswersJsonOnChangeEvent() {

    function InputAnswersJsonOnChange(event) {
        var reader = new FileReader();
        reader.onload = InputAnswersJsonOnReaderLoad;
        reader.readAsText(event.target.files[0]);
    }

    function InputAnswersJsonOnReaderLoad(event){
        console.log(event.target.result);
        var jsonparsed = JSON.parse(event.target.result);
        loadInputAnswersJson(jsonparsed);
    }
    
    function loadInputAnswersJson(jsonparsed){
        // check questions_map

        preliminary_questions_answers = jsonparsed["preliminary_questions_answers"];
        questions_array = jsonparsed["questions_array"];
        saveQuestionsArrayToLocalStorage();
        goToQuestion(0);
    }
 
    document.getElementById('inputAnswersJson').addEventListener('change', InputAnswersJsonOnChange);
}


function getFirstWords(s) {
    return ( s.split(' ').slice(0,6).join(' ') + "...?").replace("?...?", "...?");
}

function goToNext() {
    goToNextQuestion();
}


function getHex(color) {
    switch (color) {
        case "success":
            return greenhex;
        case "green":
            return greenhex;
        case "danger":
            return redhex;
        case "red":
            return redhex;
        case "warning":
            return yellowhex;
        case "gray":
            return grayhex;
        case "dark":
            return grayhex;
        case "lightgray":
            return lightgrayhex;
        case "secondary":
            return lightgrayhex;
        default:
            return greenhex;
    }
}

function addTdSpace (tr, rowspan) {
    var td_space = document.createElement("td");
    td_space.setAttribute("rowspan", rowspan);    
    td_space.classList.add("borderless-cell");
    td_space.style.width = "1vw";
    tr.appendChild(td_space);
}
               

function getRoundedPercentages(v) {
    var t = v.reduce((a, b) => a + b, 0);
    var p = [];
    var r = [];
    var q = [];
    v.forEach( function(v1) {
        var q1 = v1 *100 /t;
        q.push(q1);
        var p1 = Math.floor(q1);
        var r1 = q1 - p1;
        p.push(p1);
        r.push(r1);
    } );
    var missing = 100 - p.reduce((a, b) => a + b, 0);
    var r_ord = r.slice(0); 
    r_ord.sort(  function(a, b){return b - a});
    var z = arrayOfZeros(v.length);
    for (var j=0; j<missing; j++)
        for (k in r) {
            if ( (r[k] == r_ord[j]) && !z[k] ) {
                    p[k] ++;
                z[k] = 1;
                break;
            }
        }   
    return p;
}


function printToPdfPage(doc, y, pages_count) {
    if (y > 277 ) {
                doc.addPage();
                pages_count++;
                y = 20;
            }
}


function getRgbFromHex(hex) {
    var rgb = [];
    for (let i=0; i<3;i++) {
        var s = hex.substring(1+i*2, 3+i*2);
        var int = parseInt(s, 16);
        int = Math.round((160/255 * (int) ) + 95);
        rgb.push(int);
    }
    return rgb;
}


function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild; 
}

function createQuestionsTableTr(s) {
    var tr = document.createElement("tr");
    for (var j in s) {
        var td = document.createElement("td");
        td.style.width ="33%";
        td.appendChild(document.createTextNode(s[j]));
        tr.appendChild(td);
    }
    return tr;
}

function makeAutotable(doc, rows, y, pages_count ) {

    doc.autoTable(["","",""], rows,    {
                                                        willDrawCell: function (data) {
                                                                                            console.log(data.cell.raw);
                                                                                            if (data.cell.raw == "No answer provided\n") {
                                                                                                doc.setFontStyle("italic");
                                                                                            }
                                                                                            doc.setTextColor(0,0,0);
                                                                                            var posY = data.row.y + data.row.height;
                                                                                            if ( posY > 250 ) {                                                                                                
                                                                                            }
                                                                                            data.row.y  =20;
                                                                                            if ( (data.row.index == 0) )  {
                                                                                                doc.setFontStyle("bold");
                                                                                                return true;
                                                                                            } else { 
                                                                                                return true;
                                                                                            }                                                                                            
                                                                                        },

                                                        theme: 'grid',

                                                        styles: { "overflow": "linebreak", "cellWidth": "wrap", "rowPageBreak": "avoid", "cellPadding" : 1, "fontSize": 12}, 

                                                        columnStyles: {
                                                                        0: {cellWidth: 34},
                                                                        1: {cellWidth: 33, fontStyle: 'bold'},
                                                                        2: {cellWidth: 33, fontStyle: 'bold'},
                                                                      },
                                                        bodyStyles: {
                                                                        lineColor: [0, 0, 0]
                                                                    },
                                                        startY: y - 2,
                                                        margin: { horizontal: 20 },

                                                    }
                                                );
                y = doc.lastAutoTable.finalY + 12 ;
                return y;
}