"use strict";
const menuAbrir = (e) => {
    console.log(mk.QdataGet(e, "go"));
    window.location = "/" + mk.QdataGet(e, "go");
};
