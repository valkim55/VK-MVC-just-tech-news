// create a function to attach an event listener to and then make a fetch request to the /api/posts/upvote
async  function upvoteClickHandler(event) {
    event.preventDefault();
    
    // to make vote on a comment you will need to make a PUT request and to do that you need post_id and user_id
    // you'll access user_id from the logged in session, and post_id you'll take from single-post.handlebars URL by splitting the url like a string
    const id = window.location.toString().split('/')[window.location.toString().split('/').length-1];
    
    const response = await fetch('/api/posts/upvote', {
        method: 'put',
        body: JSON.stringify({post_id: id}),
        headers: { 'Content-Type': 'application/json' }
    });

    if(response.ok) {
        console.log('upvote button clicked', id);
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);