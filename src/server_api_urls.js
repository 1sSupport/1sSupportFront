export const ServerAPIDomain = "https://api.4buttons.ru/1c/v0.1";
//export const ServerAPIDomain = "http://localhost:10000";

export const ServerAPIUrls = Object.freeze({
    SURPRISE: ServerAPIDomain + "/server_infos/surprise",
    LOGIN: ServerAPIDomain + "/tokens/login",
    LOGOUT: ServerAPIDomain + "/tokens/logout",
    GET_SUPPORT_MESSAGES_TITLES: ServerAPIDomain + "/support_questions/titles",
    CREATE_SUPPORT_MESSAGES: ServerAPIDomain + "/support_questions",
    GET_SEARCH: ServerAPIDomain + "/search",
    GET_POPULAR_SEARCH: ServerAPIDomain + "/search/popular",
    GET_ARTICLE: ServerAPIDomain + "/articles",
    SET_ARTICLES_MARKS: ServerAPIDomain + "/articles/marks"
});