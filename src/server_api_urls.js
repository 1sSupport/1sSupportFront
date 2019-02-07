export const ServerAPIDomain = "https://api.4buttons.ru/1c/v0.1";
//export const ServerAPIDomain = "http://localhost:10000";

export const ServerAPIUrls = Object.freeze({
    SURPRISE: ServerAPIDomain + "/server_infos/surprise",
    LOGIN: ServerAPIDomain + "/tokens/login",
    LOGOUT: ServerAPIDomain + "/tokens/logout",
    GET_SUPPORT_MESSAGES_TITLES: ServerAPIDomain + "/support_messages/titles",
    CREATE_SUPPORT_MESSAGES: ServerAPIDomain + "/support_messages",
    GET_ARTICLE: ServerAPIDomain + "/articles",
    GET_ARTICLES_PREVIEWS: ServerAPIDomain + "/articles/previews",
    GET_ARTICLES_MARKS: ServerAPIDomain + "/articles/marks",
    SET_ARTICLES_MARKS: ServerAPIDomain + "/articles/marks"
});