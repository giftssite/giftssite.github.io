async function handleSubmit(event,content_type,object_pk) {
    event.preventDefault(); // 防止默认的表单提交行为
    // 获取表单和表单的数据,定义表单的id="commentForm-{{object_pk}}"
    const form = document.getElementById(`commentForm-${object_pk}`);
    const formData = new FormData(form);

    try {
        // 从后端获取
        const response = await fetch(`/comments/api/comment/`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': formData.get('csrfmiddlewaretoken')
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        const data = await response.json();
        alert('提交成功');

        updateCommentsList(content_type,object_pk); // 示例函数，用于更新评论列表
    } catch (error) {
        console.error('Error:', error);
        alert('提交失败，请重试。');
        // 处理错误，更新表单的错误提示
        if (error) {
            for (const [field, messages] of Object.entries(error)) {
                const input = document.querySelector(`[name="${field}"]`);
                if (input) {
                    input.classList.add('is-invalid');
                    const feedback = input.nextElementSibling;
                    if (feedback && feedback.classList.contains('invalid-feedback')) {
                        feedback.innerText = messages.join(', ');
                    }
                }
            }
        }
    }
}
// 显示评论
function renderComments(comments) {
    let commentsHTML = '';
    comments.forEach(comment => {
        let avatarUrl = comment.user && comment.user.user_profile && comment.user.user_profile.avatar.url
        ? comment.user.user_profile.avatar.url
        : "/media/images/default-avatar.original.jpg";
        commentsHTML += `
             <div id="c${comment.id}" class="comment d-flex py-1">
                <img src="${avatarUrl}"  class="me-3" alt="" height="48" width="48" />
                <div class="d-flex flex-column flex-grow-1">
                    <h6 class="comment-header mb-1 d-flex justify-content-between" style="font-size: 0.8rem">
                        <div class="d-inline flex-grow-1">
                            <span>${comment.submit_date}&nbsp;-&nbsp;${comment.url && !comment.is_removed ? `<a href="${comment.url}" target="_new" class="text-decoration-none">${comment.user_name}</a>` : comment.user_name}</span>
                            <span>${comment.can_moderate ? '&nbsp;<span class="badge text-bg-secondary">moderator</span>' : ''}&nbsp;&nbsp;<a class="permalink text-decoration-none" title="comment permalink" href="${comment.permalink}">¶</a>
                        </div>
                        <div class="d-inline">
                            ${!comment.is_removed && comment.can_moderate ? `<a class="text-decoration-none" href="/comments/delete/${comment.id}/"><i class="bi bi-trash" title="remove comment"></i></a>` : ''}
                        </div>
                    </h6>
                     ${comment.is_removed ? `
                    <p class="text-muted pb-3">
                        <em>This comment has been removed.</em>
                    </p>
                    ` : `
                    <div class="content pt-1 pb-3">
                        ${comment.comment}
                    </div>
                    `}
                </div>
            </div>
        `;
        // 如果有子评论，递归调用渲染子评论
        if (comment.children && comment.children.length > 0) {
            commentsHTML += `<div class="child-comments">`;
            commentsHTML += renderComments(comment.children);
            commentsHTML += `</div>`;
        }
    });
    return commentsHTML;
}
// 局部更新评论列表
function updateCommentsList(content_type,object_pk) {
    // 重要：定义回显div的id="commentsList-{{object_pk}}"
    const commentsContainer = document.getElementById(`commentsList-${object_pk}`);
    if (commentsContainer) {
        // 清空现有评论列表内容
        commentsContainer.innerHTML = '';

        // 使用 AJAX 或其他方式加载最新的评论列表内容
        fetch(`/comments/api/${content_type}/${object_pk}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments.');
                }
                return response.json();
            })
            .then(data => {
                const commentsHTML = renderComments(data);
                commentsContainer.innerHTML = commentsHTML;
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }
}


function getCurrentUserAvatar() {
    // Example: Fetching current user's avatar
    fetch('/mydashboard/current_user_avatar/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch avatar');
            }
            return response.json();
        })
        .then(data => {
            // Assuming data.avatar_url contains the avatar URL
            const avatarUrl = data.avatar_url;
            console.log('Current user avatar URL:', avatarUrl);
            // Use avatarUrl to display the avatar
        })
        .catch(error => {
            console.error('Error fetching avatar:', error);
        });
}