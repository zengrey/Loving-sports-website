$(function () {
    toastr.options = {
        "timeOut": "1000", //Display time
        "showDuration": "300",//Animation time
        "positionClass": "toast-center-center" //Pop-up window position
    }

    $("#shoppingQty").html(getCartProductQty());
});

//get parameters
function getparastr(strname) {
    var hrefstr, pos, parastr, para, tempstr;
    hrefstr = window.location.href;
    pos = hrefstr.indexOf("?");
    parastr = hrefstr.substring(pos + 1);
    para = parastr.split("&");
    tempstr = "";
    for (i = 0; i < para.length; i++) {
        tempstr = para[i];
        pos = tempstr.indexOf("=");
        if (tempstr.substring(0, pos) == strname) {
            return decodeURI(tempstr.substring(pos + 1));
        }
    }
    return "";
}


function searchProduct() {
    location.href = "/searchResult.html?key=" + $("#key").val();
}

// Register
function register() {
    var userName = $("#userName").val();
    var password = $("#password").val();
    var password2 = $("#password2").val();
    var lastName = $("#lastName").val();
    var firstName = $("#firstName").val();
    var email = $("#email").val();

    if (userName == "") {
        toastr.error("User name cannot be empty!");
        $("#userName").focus();
    }
    else if (password == "") {
        toastr.error("Password cannot be empty!");
        $("#password").focus();
    }
    else if (password2 == "") {
        toastr.error("Confirm password cannot be empty!");
        $("#password2").focus();
    }
    else if (password2 != password) {
        toastr.error("Two passwords are inconsistent!");
        $("#password2").focus();
    }
    else if (lastName == "") {
        toastr.error("Lastname cannot be empty!");
        $("#lastName").focus();
    }
    else if (firstName == "") {
        toastr.error("Firstname cannot be empty!");
        $("#firstName").focus();
    }
    else if (email == "") {
        toastr.error("Email cannot be empty!");
        $("#email").focus();
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Account/Register",
            dataType: "json",
            data: {
                "userName": userName,
                "password": password,
                "lastName": lastName,
                "firstName": firstName,
                "email": email
            },
            success: function (result) {
                console.log(result);
                if (result.success) {
                    setLoginInfo(userName);
                    goHome();
                }
                else {
                    toastr.error(result.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("error");
            }
        });
    }
}

// Login
function login() {
    var userName = $("#loginName").val();
    var password = $("#loginPwd").val();
    if (userName == "") {
        toastr.error("Please input the user name!");
        $("#loginName").focus();
    }
    else if (password == "") {
        toastr.error("Please input the password!");
        $("#loginPwd").focus();
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Account/Login",
            dataType: "json",
            data: { "userName": userName, "password": password },
            success: function (result) {
                console.log(result);
                if (result.success) {
                    // write username to cookie
                    setLoginInfo(userName);
                    goHome();
                }
                else {
                    toastr.error(result.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("error");
            }
        });
    }
}

function setLoginInfo(value) {
    $.cookie("userName", value);
}

function getUserName() {
    $.cookie('userName');
    return $.cookie('userName');
}

function loadUserName() {
    var name = getUserName();
    if (name != "" && name != null) {
        var htmlStr = name + ",<a class='style-red' onclick='logOut()' style='border-right: 0px;cursor: pointer;'>Log out</a>";
        $("#nowLoginName").html(htmlStr);
    }
    else {
        $("#nowLoginName").html("<a class='style-red' href='login.html'>Login</a><a class='style-red' href='sign_up.html'>Sign up</a>");
    }
}

function logOut() {
    $.cookie("userName", "");
    goHome();
}

$(function () {
    loadUserName();
});

// Product operation
function uploadProductImg() {
    AjaxProductImg();
}

function AjaxProductImg() {
    var fileUpload = $("#upFile").get(0);
    var files = fileUpload.files;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        type: "POST",
        url: "/Uploads/Add",
        contentType: false,
        dataType: "json",
        processData: false,
        data: data,
        success: function (result) {
            console.log(result);
            var obj = eval(result);
            if (obj.Success) {
                toastr.success("Upload successfully!");
                var url = obj.FileUrlList[0];
                $("#productImg").val(url);
                $("#productImgLabel").attr("src", url);
            } else {
                toastr.error(obj.Message);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("error");
        }
    });
}

function uploadDescriptionImg() {
    var fileUpload = $("#descriptionFile").get(0);
    var files = fileUpload.files;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }

    $.ajax({
        type: "POST",
        url: "/Uploads/Add",
        contentType: false,
        dataType: "json",
        processData: false,
        data: data,
        success: function (result) {
            console.log(result);
            var obj = eval(result);
            if (obj.Success) {
                toastr.success("Upload successfully!");
                var htmlStr = "";
                for (var h = 0; h < obj.FileUrlList.length; h++) {
                    htmlStr += "<img src='" + obj.FileUrlList[h] + "' />";
                }

                $("#description").html(htmlStr);
            } else {
                toastr.error(obj.Message);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("error");
        }
    });
}

function saveProduct() {

    var id = $("#productId").val();
    var productName = $("#productName").val();
    var price = $("#price").val();
    var quantity = $("#quantity").val();
    var productImg = $("#productImg").val();
    var description = $("#description").html();
    if (productName == "") {
        toastr.error("Product name cannot be empty！");
    }
    else if (price == "") {
        toastr.error("Unit price cannot be empty！");
    }
    else if (quantity == "") {
        toastr.error("Quantity cannot be empty！");
    }
    else if (productImg == "") {
        toastr.error("Please upload the main picture！");
    }
    else {
        var param = {};
        param["id"] = id;
        param["productName"] = productName;
        param["price"] = price;
        param["quantity"] = quantity;
        param["productImg"] = productImg;
        param["description"] = description;
        $.ajax({
            type: "POST",
            url: "/Product/Save",
            dataType: "json",
            data: param,
            success: function (result) {
                console.log(result);
                if (result.success) {
                    toastr.success("Save successfully!");
                    loadProduct();
                }
                else {
                    toastr.error(result.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("error");
            }
        });
    }
}

function loadProductList() {
    $.ajax({
        type: "POST",
        url: "/Product/GetList",
        dataType: "json",
        data: {},
        success: function (result) {
            if (result.length > 0) {
                var htmlStr = "";
                for (var h = 0; h < result.length; h++) {
                    var item = result[h];
                    htmlStr += "<div class='item-div'>";
                    htmlStr += "<img src='" + item.productImg + "'>";
                    htmlStr += "<div class='item-title'>" + item.productName + "</div>";
                    htmlStr += "<div class='item-div-column'>";
                    htmlStr += "<h2 class='price'>$" + item.price + "</h2>";
                    htmlStr += "<div class='item-sell'></div>";
                    
                    htmlStr += "<div class='item-remain' style='margin-top: 6px;'>Stock <span class='style-red'>" + item.quantity + "</span></div>";
                    htmlStr += "</div>";
                    htmlStr += "<button onclick='showProductDetail(\"" + item.id + "\")'>Buy now</button>";
                    htmlStr += "</div>";
                }

                $("#productListPart").html(htmlStr);
            }
            else {
                $("#productListPart").html("<div>No product</div>");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("error");
        }
    });
}

function searchProductResult() {
    console.log("searchProduct");
    var key = getparastr("key");
    console.log("searchProduct,key=" + key);
    $.ajax({
        type: "POST",
        url: "/Product/GetList",
        dataType: "json",
        data: { "key": key },
        success: function (result) {
            if (result.length > 0) {
                var htmlStr = "";
                for (var h = 0; h < result.length; h++) {
                    var item = result[h];
                    htmlStr += "<div class='item-div'>";
                    htmlStr += "<img src='" + item.productImg + "'>";
                    htmlStr += "<div class='item-title'>" + item.productName + "</div>";
                    htmlStr += "<div class='item-div-column'>";
                    htmlStr += "<h2 class='price'>$" + item.price + "</h2>";
                    htmlStr += "<div class='item-sell'></div>";

                    htmlStr += "<div class='item-remain' style='margin-top: 6px;'>Stock <span class='style-red'>" + item.quantity + "</span></div>";
                    htmlStr += "</div>";
                    htmlStr += "<button onclick='showProductDetail(\"" + item.id + "\")'>Buy now</button>";
                    htmlStr += "</div>";
                }

                $("#productListPart").html(htmlStr);
            }
            else {
                $("#productListPart").html("<div>No product</div>");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("error");
        }
    });
}

function buy() {
    var qty = $("#qty").val();
    var pid = getparastr("id");
    var userName = getUserName();
    if (userName == "" || userName == null) {
        toastr.error("Please login!");
    }
    else {
        var param = {};
        param["pid"] = pid;
        param["userName"] = userName;
        param["qty"] = qty;
        $.ajax({
            type: "POST",
            url: "/Product/Buy",
            dataType: "json",
            data: param,
            success: function (result) {
                console.log(result);
                if (result.success) {
                    alert("Purchase success！");
                    location.reload();
                }
                else {
                    toastr.error(result.message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error("error");
            }
        });
    }
}

function showProductDetail(id) {
    location.href = "/detail.html?id=" + id;
}

function loadProduct() {
    $.ajax({
        type: "POST",
        url: "/Product/GetList",
        dataType: "json",
        data: {},
        success: function (result) {
            if (result.length > 0) {
                var htmlStr = "<table>";
                htmlStr += "<tr>";
                htmlStr += "<th style='width:205px'>Main picture</th>";
                htmlStr += "<th>Product name</th>";
                htmlStr += "<th>Unit price</th>";
                htmlStr += "<th>Quantity</th>";
                htmlStr += "<th>Operation</th>";
                htmlStr += "</tr>";
                for (var h = 0; h < result.length; h++) {
                    var item = result[h];

                    htmlStr += "<tr>";
                    htmlStr += "<td><img src='" + item.productImg + "' style='width:200px;height:auto;'/></td>";
                    htmlStr += "<td>" + item.productName + "</td>";
                    htmlStr += "<td>" + item.price + "</td>";
                    htmlStr += "<td>" + item.quantity + "</td>";
                    htmlStr += "<td><input type='button' value='Edit' onclick='editProduct(\"" + item.id + "\")' /></td>";
                    htmlStr += "</tr>";
                }
                htmlStr += "</table>";

                $("#productList").html(htmlStr);
            }
            else {
                $("#productList").html("");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("error");
        }
    });
}

function editProduct(id) {
    $.ajax({
        type: "POST",
        url: "/Product/GetDetailData",
        dataType: "json",
        data: { "id": id },
        success: function (result) {
            console.log(result);
            $("#productId").val(result.id);
            $("#productName").val(result.productName);
            $("#price").val(result.price);
            $("#quantity").val(result.quantity);
            $("#productImg").val(result.productImg);
            $("#description").html(result.description);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("error");
        }
    });
}

function loadProductDetail() {
    var id = getparastr("id");
    $.ajax({
        type: "POST",
        url: "/Product/GetDetailData",
        dataType: "json",
        data: { "id": id },
        success: function (result) {
            
            $("#produtName").html(result.productName);
            $("#price").html(result.price);
            $("#small").css("background-image", "url('" + result.productImg + "')")
            $("#big").css("background-image", "url('" + result.productImg + "')")
           // $("#small").style.background = "url(" + result.productImg+")";
           // $("#small").style.background(result.productImg);
            console.log("description=" + result.description);
            $("#description").html(result.description);
            $("#qtyStr").html(result.quantity);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error("error");
        }
    });
}
// Product end

// Shopping cart
function addCartProduct(productId, qty) {
    var cart = $.cookie("cart");
    if (cart == "" || cart == null) { // Judge whether cookie exists
        cart = {
            "goods": [
                { "goodId": productId, "qty": qty }
            ]
        }
        $.cookie("cart", JSON.stringify(cart));
    }
    else {
        cart = JSON.parse(cart);
        var isExist = false;
        for (var g = 0; g < cart.goods.length; g++) {
            if (cart.goods[g].goodId == productId) {
                cart.goods[g].qty += qty;
                isExist = true;
                break;
            }
        }
        if (isExist == false) {
            cart.goods.push({
                "goodId": productId, "qty": qty
            });
        }
        $.cookie("cart", JSON.stringify(cart));
    }
    console.log(JSON.stringify(cart));
    toastr.success("Added successfully");
    setTimeout(function () {
        location.reload();
    }, 1000);
}

function getCartProductQty() {
    var count = 0;
    var cart = $.cookie("cart");
    if (cart != "" && cart != null) { // Judge whether cookie exists
        cart = JSON.parse(cart);
        count = cart.goods.length;
    }
    return count;
}
// Shopping cart end

function goHome() {
    location.href = "/index.html";
}

