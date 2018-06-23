$(() => {
  let skip = 2;
  let limit = 2;

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
      console.log(collection);
      if(collection.length === 0){
        $('#paginationButton').attr('disabled', true);
        alert("There are no other auctions right now");
      }
      collection.forEach(elem => {
        $('#auctionList').append(`<ul class="list-group">
            <li class="list-group-item">Title: ${elem.title}</li>
            <li class="list-group-item">Description: ${elem.description}</li>
            <li class="list-group-item">Type: ${elem.isBuyNow ? 'Buy now' : 'Standard'}</li>
            <li class="list-group-item">Price: ${elem.price}</li>
            <li class="list-group-item">End time: ${elem.endTime}</li>            
        </ul>
        <br/>`);
        if(userName){
          if(elem.isBuyNow){
            $('#auctionList').append(`<button id="buyNowButton" type="submit" class="btn btn-default">Buy now!</button>`);
          }else{
            $('#auctionList').append(`<input type="number" step="0.01" min="0" class="form-control" placeholder="Bid"
                                   name="bid">`);
            $('#auctionList').append(`<button id="bidButton" type="submit" class="btn btn-default">Bid!</button>`);
          }
        }
      });
    }
  };

  $('#paginationButton').on('click', () => {
    loadMore(skip, limit);
    skip += 2;
  });
});