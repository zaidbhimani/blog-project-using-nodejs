$(document).ready(function() {
    // var URL =  'http://localhost:3000/todos';
    var POSTURL = "https://blog-nodejs-learning.herokuapp.com/api/posts";
    var GETURL = "https://blog-nodejs-learning.herokuapp.com/api/posts";
    var DELETEURL = "https://blog-nodejs-learning.herokuapp.com/api/posts/";
    var EDITURL = "https://blog-nodejs-learning.herokuapp.com/api/posts/";
    var LIKEURL = "https://blog-nodejs-learning.herokuapp.com/api/inclikes/";

    var source = $("#blog-container").html();
    var template = Handlebars.compile(source);

    var $listgroup = $(".listgroup");

    $(".post-button").on("click", function() {

        var titletext = $('.title-input-tag').val();
        var descriptiontext = $('.description-input-tag').val();
        // console.log(titletext)
        // console.log(descriptiontext)
        if (titletext.length == 0) {
            alert("plz fill blank field")
        } else if (descriptiontext.length == 0) {
            alert("plz fill blank field")
        } else {
            $.ajax({
                url: POSTURL,
                method: 'POST',
                data: {
                    title: titletext,
                    desc: descriptiontext,
                }
            }).done(function(data) {
                console.log(data)
                var setnewblog = template({
                    title: data.title,
                    description: data.desc,
                    likesno: data.likes,
                    id: data._id
                });
                $listgroup.append(setnewblog);
            }).fail(function(err) {
                //err
            });

            $('.title-input-tag').val('');
            $('.description-input-tag').val('');

        }
    }); //END OF POST EVENT

    $.ajax({
        url: GETURL,
        method: 'GET'
    }).done(function(datawrapper) {
        // console.log("datawrapper",datawrapper)

        datawrapper.data.forEach(function(element) {
            // console.log("element",element)
            getsettedblog = template({
                title: element.title,
                description: element.desc,
                likesno: element.likes,
                id: element._id
            });
            $listgroup.append(getsettedblog);
        });

    }).fail(function(err) {
        // err
    });
    //END OF GET REQUEST

    //START OF POPOVER
    var popover = $("#popover-container").html();
    var popovertemplate = Handlebars.compile(popover);

    $listgroup.on("click", 'Span', function(evt) {
        // alert();
        var getparentid = $(evt.target).closest(".blog-wrapper");
        var getactualid = getparentid.attr('id');
        // console.log(getactualid)
        // 
        var gettitle = getparentid.find(".posted-title").text();
        // console.log('gettitle',gettitle);

        var getdescription = getparentid.find(".posted-description").text();
        // console.log('getdescription',getdescription);

        var getlikes = getparentid.find(".likes-wrapper > span").html();
        // console.log(getlikes)

        var showpopover = popovertemplate({
            text: gettitle,
            body: getdescription,
            likesno: getlikes,
            id: getactualid
        });
        // console.log(showpopover)
        $(".popover-domcontainer").html(showpopover);
        $(".popover-domcontainer").css("display", "block");
        // console.log($(evt.target))
        $.ajax({
            url: POSTCOMMENT + getactualid,
            method: "GET",
        }).done(function(datawrapper) {
            // console.log(data)
            datawrapper.data.forEach(function(data) {
                // console.log(data)
                var getauthor = data.author;
                var gettext = data.text;
                $(".added-comments-wrapper > ul").append("<li>" + getauthor + "</br>" + gettext + "</li>");
            });
        }).fail(function() {
            // err
        });

    });

    $(".popover-domcontainer").on("click", ".popover-cancel-button", function() {
        $(".popover-domcontainer").css("display", "none");
    }); //END OF CANCEL EVENT

    $(".popover-domcontainer").on("click", ".delete-button", function(evt) {
        // alert();
        var getparentdom = $(evt.target).closest(".popover-wrapper");
        // console.log(getparentdom)
        var getparentdomid = getparentdom.attr("id");

        // $('#' + getparentdomid).remove();


        // console.log(getparentdomid)
        var findblogwrapper = $listgroup.find(".blog-wrapper");
        // console.log(findblogwrapper);
        $(findblogwrapper).map(function(index, element) {
            // console.log("index",index)
            // console.log("element",element)
            // console.log($(element).attr("id"));
            var catchingid = $(element).attr("id");
            if (catchingid == getparentdomid) {
                // alert('this is the one')
                $(this).remove();
            }
        });

        $.ajax({
            url: DELETEURL + getparentdomid,
            method: "DELETE"
        });

        $(".popover-domcontainer").css("display", "none");
    });

    var editcontainer = $("#edit-container").html();
    var edittemplate = Handlebars.compile(editcontainer);

    var likes = '';
    // console.log(likes)
    $(".popover-domcontainer").on("click", ".update-button", function(evt) {
        // alert();
        var oldtext = $(evt.target).closest(".popover-wrapper");
        // console.log(oldtext)
        var getid = oldtext.attr("id");
        // console.log(id)
        var getoldtext = oldtext.find(".popover-description").html();
        // console.log(getoldtext)
        var getoldtitle = oldtext.find(".popover-title").html();

        var getoldlikes = oldtext.find(".likes-container > span").html();
        // console.log(getoldlikes)
        likes = getoldlikes;
        // console.log(likes)
        var setoldtext = edittemplate({
            title: getoldtitle,
            text: getoldtext,
            id: getid
        });

        // $(evt.target).closest(".popover-wrapper").hide();
        $(".popover-wrapper").hide();

        $(".popover-domcontainer").html(setoldtext)
    });

    $(".popover-domcontainer").on("click", ".save-button", function(evt) {
        // alert();
        var getparenttag = $(evt.target).closest('.edit-wrapper');
        // console.log(getparenttag)
        var gettitle = getparenttag.find(".edit-title > input").val();
        // console.log(gettitle)
        var getid = getparenttag.attr("id");
        // console.log(getid)
        // var getlikes = getid.find(".likes-container");
        // console.log(getlikes)
        var getnewtext = getparenttag.find(".edit-input-tagwrapper > textarea").val();
        // console.log(getnewtext)
        // var getlikestext = getparenttag.find("")
        var setnewtext = popovertemplate({
            text: gettitle,
            body: getnewtext,
            likesno: likes,
            id: getid
        });
        // console.log(setnewtext)
        getparenttag.remove();
        $(".popover-domcontainer").html(setnewtext)
        $(".popover-wrapper").show();

        var findblogwrapper = $listgroup.find(".blog-wrapper");
        // console.log(findblogwrapper);
        $(findblogwrapper).map(function(index, element) {
            // console.log("index",index)
            // console.log("element",element)
            // console.log($(element).attr("id"));
            var catchingid = $(element).attr("id");
            if (catchingid == getid) {
                var setToTheDom = template({
                    title: gettitle,
                    description: getnewtext,
                    likesno: likes,
                    id: getid
                });

                $(this).html(setToTheDom);
            }
        }); //end of map method
        $.ajax({
            url: EDITURL + getid,
            method: "PUT",
            data: {
                title: gettitle,
                desc: getnewtext
            }
        });


    }); //END OF SAVE EVENT

    // START OF LIKE EVENT
    // var indexNum = 0;
    $(".popover-domcontainer").on("click", ".like-button", function(evt) {
        // alert();
        // indexNum = indexNum + 1;
        // console.log(indexNum)
        var catchparent = $(evt.target).closest(".popover-wrapper");
        var gettitle = catchparent.find(".popover-title").html();
        var getdescription = catchparent.find(".popover-description").html();
        var catchid = catchparent.attr("id");

        // console.log(catchid)

        // var catchspan = catchparent.find(".likes-container > span").html(indexNum);  
        // console.log(catchspan);
        var findblogwrapper = $listgroup.find(".blog-wrapper");
        // var catchlikes = findblogwrapper.find(".likes-wrapper > span");
        var setlikestopopover = '';
        $(findblogwrapper).map(function(index, element) {
            // console.log(element)

            var catchingid = $(element).attr("id");
            // var catchclass =$(element).attr("class");
            // console.log(catchclass)

            // console.log(catchingid)
            // var catchinglikeswrapper = $(element).find(".likes-wrapper > span").text();
            // console.log(catchinglikeswrapper)
            if (catchingid == catchid) {
                var getlikesno = $(this).find(".likes-wrapper > span").text();
                getlikesno = parseInt(getlikesno) + 1;
                $(this).find(".likes-wrapper > span").text(getlikesno);
                setlikestopopover = getlikesno;
                // parseInt(getlikesno) +  1;
            }
        }); //end of map method

        var catchspan = catchparent.find(".likes-container > span").html(setlikestopopover);

        $.ajax({
            url: LIKEURL + catchid,
            method: "PUT",
            data: {
                likes: setlikestopopover
            }
        });

    }); // END OF LIKE EVENT



    var POSTCOMMENT = "https://blog-nodejs-learning.herokuapp.com/api/comments/";
    var GETCOMMENT = "https://blog-nodejs-learning.herokuapp.com/api/comments/";
    // var DELETECOMMENT
    // var EDITCOMMENT
    $(".popover-domcontainer").on("click", ".add-comment > button", function(evt) {
        var catchparent = $(evt.target).closest(".popover-wrapper");
        var catchid = catchparent.attr("id");

        var inputtext = $(".comments-add-input > input").val();
        $(".added-comments-wrapper > ul").append('<li>' + "zaid </br>" + inputtext +"<button class='del'>delete</button>"+'</li>');
        $(".comments-add-input > input").val("");

        var commentlength = $(".added-comments-wrapper > ul > li").length;
        // console.log(commentlength)
        $(".commentnumber-display > span").html(commentlength)

        $.ajax({
            url: POSTCOMMENT + catchid,
            method: "POST",
            data: {
                author: "zaid",
                text: inputtext
            }
        });

    }); //END OF POST COMMENT
    // var catchparent = $(evt.target).closest(".popover-wrapper");
    // var catchid = catchparent.attr("id");

    // $.ajax({
    //   url:POSTCOMMENT + catchid,
    //   method:"GET",
    // }).done(function(data){
    //  console.log(data)
    // }).fail(function(){
    //   // err
    // });


    //END OF POPOVER

}); //MAIN ENDING