export const ServerAPIDomain = "https://api.4buttons.ru/1c/v0.1";

export const ServerAPIUrls = Object.freeze({
    SURPRISE: ServerAPIDomain + "/server_infos/surprise",
    LOGIN: ServerAPIDomain + "/tokens/login",
    LOGOUT: ServerAPIDomain + "/tokens/logout",
    GET_SUPPORT_MESSAGES: ServerAPIDomain + "/support_messages",
    CREATE_SUPPORT_MESSAGES: ServerAPIDomain + "/support_messages",
    GET_ARTICLE: ServerAPIDomain + "/articles/",
    GET_ARTICLES_PREVIEWS: ServerAPIDomain + "/articles/previews",
    GET_ARTICLES_MARKS: "/articles/marks",
    SET_ARTICLES_MARKS: "/articles/marks"
});