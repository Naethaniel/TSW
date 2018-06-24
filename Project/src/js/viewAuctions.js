$(() => {
  let skip = 0;
  let limit = 2;

  const createElement = (elem, userName) => {
    let string = `<div id="${elem.id}">
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
        string += `<input type="number" step="0.01" min="0" class="form-control" placeholder="Bid" name="bid">`;
        string += `<button id="bidButton" type="submit" class="btn btn-default">Bid!</button>
            </ul>
            <br/>
        </div>`
      }
    }
    return string;
  };

  const loadMore = (skip, limit) => {
    $.ajax({
      url: "/auctions",
      type: "POST",
      data: JSON.stringify({skip, limit}),
      contentType: "application/json",
      complete: handlePagination
    });
  };

  const handlePagination = (json) => {
    if (json.status === 200) {
      let {collection, userName} = json.responseJSON;
      if(collection.length === 0){
        $('#paginationButton').attr('disabled', true);
        alert("There are no other auctions right now");
      }
      collection.forEach(elem => {
        $('#auctionList').append(createElement(elem, userName));
      });
    }
  };

  $('#paginationButton').on('click', () => {
    loadMore(skip, limit);
    skip += 2;
  });
});