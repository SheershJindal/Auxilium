const config = {
    screens: {
        Auth: {
            path: "auth"
        },
        Forgot: {
            path: "forgot"
        },
        Verification: {
            path: "verify"
        },
        Home: {
            path: ""
        },
        Announcement: {
            path: "announcements"
        },
        Settings: {
            path: "settings"
        },
        CreatePost: {
            path: "create"
        },
        Post: {
            path: "post/:id"
        },
        ReactToPost: {
            path: "react",
        },
        Community: {
            path: "community/:id"
        }
    }
}

const linking = {
    prefixes: ["epics://app"],
    config
}

export default linking;