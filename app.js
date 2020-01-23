stocksList = [
  { symbol: "HD", company: "The Home Depot, Inc." },
  { symbol: "UPS", company: "United Parcel Service, Inc." },
  { symbol: "KO", company: "The Coca-Cola Co. " },
  { symbol: "DAL", company: "Delta Air Lines, Inc." },
  { symbol: "SO", company: "The Southern Co. " },
  { symbol: "GPC", company: "Genuine Parts Co." },
  { symbol: "WRK", company: "WestRock Co. " },
  { symbol: "NCR", company: "NCR Corp." },
  { symbol: "ICE", company: "Intercontinental Exchange, Inc." }
];
token = "pk_110eba9da8c84c0e88d885292085ab63";

//-------creating validationList[] of stock symbols available-----//////
let validationList = [];
let validSymbol = "";
const symbolQuery = `https://api.iextrading.com/1.0/ref-data/symbols`;

//define hover effect function for stock buttons to reveal company name //
$(document).ready(function(){
    $(".buttonRow").on("mouseenter", ".stock-btn", function(event){
        const company = event.target.value;
        // const percent = event.target.percent;
      $(".pantalla").text(company);
    });
    $(".stock-btn").mouseleave(function(){
      $(".pantalla").text("");
    });
  });

$.ajax({
  url: symbolQuery,
  method: "Get"
}).then(function(resSymbol) {
  for (i = 0; i < resSymbol.length; i++) {
    validSymbol = {
      symbol: resSymbol[i].symbol,
      company: resSymbol[i].name,
      changePercent: 0
    };
    validationList.push(validSymbol);
  }
  for (i =0; i < validationList.length; i++) {
    $.ajax({
      url: `https://cloud.iexapis.com/stable/stock/${array[i].symbol}/quote?token=${token}`,
      method: "GET"
    }).then(function(response) {
      validationList[i].changePercent = response.changePercent
    })
  }

  return validationList;
});

//-----Displaying Stock Data after button is clicked-----//
const displayStockInfo = function() {
  const stock = $(this).attr("data-name");
  const stockQuery = `https://cloud.iexapis.com/stable/stock/${stock}/quote?token=${token}`;
  const newsQuery = `https://cloud.iexapis.com/stable/stock/${stock}/news?token=${token}`;
  const newStockDiv = $("<div>").addClass("card-body"); //create div to hold indivdual stock info

  $.ajax({
    url: stockQuery,
    method: "GET"
  }).then(function(response) {
    const closeBtn = $("<button>")
      .addClass("killDiv btn btn-outline-info")
      .text("Close")
      .css("float", "right");
    newStockDiv.append(closeBtn);

    const logoPic = `https://storage.googleapis.com/iex/api/logos/${stock}.png`;
    const logoHolder = $(
      `<img src=${logoPic} onerror='this.src="./images/iex.png"' />`
    ).addClass("logo"); //logo img created
    newStockDiv.append(logoHolder); //adds logo img to the front of the company name

    const companyName = response.companyName; //retrieves and stores name from api
    const nameHolder = $('<h3 class="card-title">').text(`${companyName}   `); //formats stored name into html code
    newStockDiv.append(nameHolder); //appends above name into new stock div

    const exchange = response.primaryExchange;
    const exchangeHolder = $('<p class="card-text">')
      .text(`on ${exchange}`)
      .css("font-size", "14px");
    newStockDiv.append(exchangeHolder);

    const moreBtn = $("<button>")
      .addClass("btn btn-outline-info seeMore")
      .text("See More")
      .css("float", "right");
    newStockDiv.append(moreBtn);
    const lessBtn = $("<button>")
      .addClass("btn btn-outline-info seeLess")
      .text("See Less")
      .css("float", "right")
      .hide();
    newStockDiv.append(lessBtn);

    //repeating above 3 steps (minus logo img append) for stock symbol
    const stockSymbol = response.symbol; //retrieves symbol from api
    const symbolHolder = $('<p class="card-text">').text(
      `Stock Symbol: ${stockSymbol}`
    );
    newStockDiv.append(symbolHolder);

    //repeating above steps for stock price
    const stockPrice = response.latestPrice;
    const priceHolder = $('<p class="card-text">').text(
      `Stock Price: ${stockPrice}`
    );
    newStockDiv.append(priceHolder);

    //creating "See More Info" button and function
    const previousClose = response.previousClose;
    const change = response.change;
    const changePercent = response.changePercent;
    const week52High = response.week52High;
    const week52Low = response.week52Low;
    const ytdChange = response.ytdChange;
    const prevHolder = $('<p class="card-text more">')
      .text(`Previous Close: ${previousClose}`)
      .hide();
    const changeHolder = $('<p class="card-text more">')
      .text(`Change: ${change}`)
      .hide();
    const percentHolder = $('<p class="card-text more">')
      .text(`Change Percent: ${changePercent}`)
      .hide();
    const highHolder = $('<p class="card-text more">')
      .text(`52-week High: ${week52High}`)
      .hide();
    const lowHolder = $('<p class="card-text more">')
      .text(`52-week Low: ${week52Low}`)
      .hide();
    const ytdHolder = $('<p class="card-text more">')
      .text(`Year-to-date Change: ${ytdChange}`)
      .hide();
    newStockDiv.append(prevHolder);
    newStockDiv.append(changeHolder);
    newStockDiv.append(percentHolder);
    newStockDiv.append(highHolder);
    newStockDiv.append(lowHolder);
    newStockDiv.append(ytdHolder);

    $.ajax({
      url: newsQuery,
      method: "GET"
    }).then(function(nResponse) {
      const companyNews = nResponse[0].headline;
      const newsLink = nResponse[0].url;
      const picURL = nResponse[0].image;
      const summaryHolder = $(`<p class="card-text"> >`)
        .text(`News Headline: ${companyNews}`)
        .css("clear", "both");
      const newsBtn = $(`<a href=${newsLink}>`)
        .text("  See Article  ")
        .attr("target", "_blank");
      // const newsPic = $(`<img src=${picURL} class="newsPic" alt=''>`) //.hide();
      summaryHolder.append(newsBtn);
      // summaryHolder.append(newsPic);
      newStockDiv.append(summaryHolder);
    });
    $("#stockForm").after(newStockDiv);
  });
};

//------------Rendering Button Group to Page------//
const renderButtons = function() {
  //reset button list
  $(".buttonRow").empty();
  for (i = 0; i < stocksList.length; i++) {
    const newButton = $("<button>").addClass("btn btn-info");
    newButton.addClass("stock-btn");
    newButton.attr("data-name", stocksList[i].symbol);
    newButton.attr("value", stocksList[i].company + " ..." +stocksList[i].changePercent + "%");
    newButton.text(stocksList[i].symbol.toUpperCase());

    $(".buttonRow").append(newButton);
  }
};

//-------Receiving Input to make New Buttons----------------//
const addButton = function(event) {
  event.preventDefault();
  const stockInput = $("#stockInput")
    .val()
    .trim();
  const upperCaseStock = stockInput.toUpperCase();
  let searchSymbol = validationList.find( //returns undefined if stock symbol absent from list, returns object if present
    valSym => valSym.symbol === upperCaseStock
  );
  $("#stockInput").val("");
  if (searchSymbol) {
    newStock = {
      symbol: searchSymbol.symbol,
      company: searchSymbol.company
    };
    stocksList.push(newStock);
    renderButtons();
  } else {
    $("#stockInput").val("");
    $("#stockInput").addClass("redFont");
    $(".pantalla").text(
        `"${upperCaseStock}" is not a valid symbol`);
    $("#stockInput").attr
        ("placeholder", `"${stockInput}" is not a valid symbol`
      );
    setTimeout(function() {
        $(".pantalla").text("");
        $("#stockInput").removeClass("redFont");
        $("#stockInput").attr("placeholder", "enter stock symbol");
    },2000);
  }
};

//--------------Function Calling --------------//
$(document).on("click", ".seeMore", function() {
  $(this)
    .parent()
    .children(".seeMore")
    .hide();
  $(this)
    .parent()
    .children(".more")
    .toggle("display");
  $(this)
    .parent()
    .children(".seeLess")
    .show();
});
$(document).on("click", ".seeLess", function() {
  $(this)
    .parent()
    .children(".seeLess")
    .hide();
  $(this)
    .parent()
    .children(".more")
    .toggle("display");
  $(this)
    .parent()
    .children(".seeMore")
    .show();
});
$(document).on("click", ".killDiv", function() {
  $(this)
    .parent()
    .hide();
});
$("#addStock").on("click", addButton);
$(".buttonRow").on("click", ".stock-btn", displayStockInfo);
renderButtons();
