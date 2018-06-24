$(() => {
  let skip = 2;
  const createElement = (elem, userName) => {
    let string = `<div id="${elem._id}">
        <ul class="list-group">
        <li class="list-group-item">Title: ${elem.title}</li>
        <li class="list-group-item">Description: ${elem.description}</li>
        <li class="list-group-item">Type: ${elem.isBuyNow ? 'Buy now' : 'Standard'}</li>
        <li class="list-group-item">Price: ${elem.price}</li>
        <li class="list-group-item">End time: ${elem.endTime}</li>`;
    if (userName) {
      if (elem.isBuyNow) {
        string += `<button id="buyNowButton" type="submit" class="btn btn-default">Buy now!</button>
            </ul>
            <br/>
        </div>`
      } else {
        string += `<input type="number" step="0.01" min="${elem.price+1}" class="form-control" placeholder="Bid" name="bid">`;
        string += `<button id="bidButton" type="submit" class="btn btn-default">Bid!</button>
            </ul>
            <br/>
        </div>`
      }
    }
    return string;
  };

  const loadMore = (skip) => {
    $.ajax({
      url: "/auctions/paginate",
      type: "GET",
      data: {skip},
      // contentType: "application/json",
      complete: handlePagination
    });
  };

  const buy = (id) => {
    $.ajax({
      url: "/auctions/buy",
      type: "POST",
      data: JSON.stringify({id}),
      contentType: "application/json",
      complete: handleBuy
    });
  };

  const bid = (id, ammount) => {
    $.ajax({
      url: "/auctions/bid",
      type: "POST",
      data: JSON.stringify({id, ammount}),
      contentType: "application/json",
      complete: handleBid
    });
  };

  const handleBuy = (response) => {
    if (response.status === 200) {
      //remove this element from the list?
      alert('kupiles gratulacje');
    }
    else {
      alert('cos poszlo nie tak');
      console.log(response);
    }
  };

  const handleBid = (response) => {
    if (response.status === 200) {
      //remove this element from the list?
      alert('zbidowales gratulacje');
    }
    else {
      alert('cos poszlo nie tak');
      console.log(response);
    }
  };

  const handlePagination = (json) => {
    if (json.status === 200) {
      let {collection, userName} = json.responseJSON;
      if(collection.length === 0){
        $('#paginationButton').attr('disabled', true);
        alert("There are no other auctions right now");
      }
      collection.forEach(elem => {
        if(!elem.isFinished){
          $('#auctionList').append(createElement(elem, userName));
        }
      });
    }
  };

  $('#paginationButton').on('click', () => {
    loadMore(skip);
    skip += 2;
  });

  //delegowac event onclick buy now/bid do auctionList ---> cos nie chce dzialac ;/ -> zmienic z geta na post wysylac jsonem
  //ustawic na inpucie dla bida min wartosc z elem.price


  //DODAC USERA? albo pobrac ro z req.locals po serwerze
//buyNow!
  $('#auctionList').on('click', ' #buyNowButton', (e) => {
    let id = $(e.target).parent().parent().attr('id');
    //post ajax to the auctions/buy?id
    buy(id);
  });

  //bid
  $('#auctionList').on('click', '#bidButton', (e) => {
    let id = $(e.target).parent().parent().attr('id');
    let ammount = $(e.target).prev().val();
    //post ajax to the auctions/bid?id&?ammount
    bid(id, ammount);
  });

});