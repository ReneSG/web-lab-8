const BASE_URL = "http://localhost:8080"

function getAllPosts() {
  $.getJSON(BASE_URL + "/blog-posts", renderAllPosts)
}


$("#updatePost").click((e) => {
  e.preventDefault();

  const body = {
    id: $("#updatePostId").val(),
    title: $("#updatePostTitle").val(),
    content: $("#updatePostContent").val(),
    author: $("#updatePostAuthor").val(),
    publishDate: $("#updatePostPublishDate").val(),
  }

  $.ajax({
    url: BASE_URL + "/blog-posts/" + body.id,
    type: "PUT",
    dataType: 'json',
    data: body,
    success: getAllPosts,
    error: displayError
  });

});

$("#createPost").click((e) => {
  e.preventDefault();

  const body = {
    title: $("#postTitle").val(),
    content: $("#postContent").val(),
    author: $("#postAuthor").val(),
    publishDate: $("#postPublishDate").val(),
  }

  $.ajax({
    url: BASE_URL + "/blog-posts",
    type: "POST",
    dataType: 'json',
    data: body,
    success: getAllPosts,
    error: displayError
  });

});

$("#deletePost").click((e) => {
  e.preventDefault();

  $.ajax({
    url: BASE_URL + "/blog-posts/" + $("#deletePostId").val(),
    type: "DELETE",
    dataType: 'json',
    success: getAllPosts,
    error: displayError
  });

});

function renderAllPosts(response) {
  const postContainer = $("#postContainer")
  postContainer.empty();
  response.forEach((el) => {
    const item = "<div>" + JSON.stringify(el) + "</div>";
    postContainer.append(item);
  });
}

function displayError(response) {
  alert(response.responseJSON.error);
}
getAllPosts();
