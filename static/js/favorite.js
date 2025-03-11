async function toggleFavorite(contentType, objectId) {
    try {
        console.log("====contentType====",contentType)
        const url = `/toggle-favorite/${encodeURIComponent(contentType)}/${encodeURIComponent(objectId)}/`;
        const response = await fetch(url, {
            method: 'GET' // 使用 POST 方法切换收藏状态
        });

        if (!response.ok) {
            throw new Error('Failed to toggle favorite');
        }

        const data = await response.json();
        console.log(data); // 输出收藏状态

        // 更新按钮文本和样式
        const favoriteId = `favorite-button-${objectId}`;
        const favoriteButton = document.getElementById(favoriteId);
        if (data.status === 'favorited') {
            console.log('Item favorited!');
            favoriteButton.innerHTML = '<i class="fa-solid fa-heart" style="color: red;"></i>';
            favoriteButton.classList.add('favorited');
        } else if (data.status === 'unfavorited') {
            console.log('Item unfavorited!');
            favoriteButton.innerHTML = '<i class="fa-regular fa-heart"></i>';
            favoriteButton.classList.remove('favorited');
        } else {
            console.log('Error occurred.');
        }

    } catch (error) {
        console.error('Error:', error);
        // 可以在页面上显示错误消息或者进行其他适当的处理
    }
}