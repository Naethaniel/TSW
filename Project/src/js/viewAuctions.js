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
      let collection = json.responseJSON;
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
            <li class="list-group-item">End time: ${elem.endTime}</li>
        </ul>
        <br/>`)
      });
    }
  };

  $('#paginationButton').on('click', () => {
    loadMore(skip, limit);
    skip += 2;
  });
});