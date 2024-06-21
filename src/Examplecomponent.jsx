import React from "react";
import { UseUser } from "./path-to-UserProvider";

function ExampleComponent() {
    const { isUserLoggedIn, user, token, signInContext, signOutContext } = UseUser();

    const handleLogin = () => {
        // Perform your login logic and get token and user
        const fakeToken = "fakeToken";
        const fakeUser = "fakeUser";

        // Call signInContext to update the context with the new user and token
        signInContext(fakeToken, fakeUser);
    };

    const handleLogout = () => {
        // Call signOutContext to log the user out
        signOutContext();
    };

    return (
        <div>
            <p>User: {user}</p>
            <p>Token: {token}</p>
            <p>Is User Logged In: {isUserLoggedIn ? "Yes" : "No"}</p>

            {isUserLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={handleLogin}>Login</button>
            )}
        </div>
    );
}

export default ExampleComponent;
