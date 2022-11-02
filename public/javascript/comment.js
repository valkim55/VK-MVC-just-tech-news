async function commentFormHandler(event) {
    event.preventDefault();
    // to post a new comment into Comment model(table) you need values for comment text, post_id and user_id columns
    // again, you'll access user_id from the loggedIn session and post_id from URL
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    const post_id = window.location.toString().split('/')[window.location.toString().split('/').length-1];
    
    if(comment_text) {
        const response = await fetch('/api/comments', {
            method: 'post',
            body: JSON.stringify({post_id, comment_text}),
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok) {
            document.location.reload();
        } else {
            alert(response.statusTExt);
        }
    }
}


document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);