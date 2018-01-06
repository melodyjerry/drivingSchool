﻿import "mainStyle/coach";
import * as af from "js/ajax/affiche";
import * as co from "js/ajax/coach";
import * as _ from "js/main/main";
import { act } from "js/common/variable";

let newStudentNum = 0;
let newMessageNum = 0;
let results=[];
let userName = "";

$(() => {
    Promise.all([
        results = _.getPersonalInformation(act),
        _.getAffiche()
    ]).then(() => {
        _.Init();
    }).then(()=>{
        $("#newStudentNum").text(results[3]);
        $("#newMessageNum").text(results[4]);
        newStudentNum = parseInt(results[3]);
        newMessageNum = parseInt(results[4]);
        userName = results[0];
    });
});
$("#exit").click(() => {
    sessionStorage.setItem("backLogin", true);
    location.href = "../account/login.html";
});

$("#releaseNews").click(() => {
    const content = $.trim(prompt("请输入新的公告内容"));
    if (content !== "") {
        if (af.setAffiche(act, content, userName)) {
            getAffiche();
        } else {
            alert("发生了点小意外~");
        }
    }
});

$("#newStudent").click(() => {
    if (newStudentNum !== 0) {
        sessionStorage.setItem("newStudentNum", newStudentNum);
        location.href = "studentList.html";
    } else {
        alert("暂无新增学员");
    }
});

$("#newMessage").click(() => {
    if (newMessageNum !== 0) {
        sessionStorage.setItem("newMessageNum", newMessageNum);
        location.href = "messageList.html";
    } else {
        alert("暂无新增预约");
    }
});