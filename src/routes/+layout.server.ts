export function load() {
	// TODO
	/*
    let auth = await getAuthFromRequest(request);
    if (auth && new URL(request.url).pathname === "/") {
        throw redirect("/home");
    }
    return auth;
    */

	return {
		userId: 1
	};
}

/*
TODO
export function shouldRevalidate({ formAction }: ShouldRevalidateFunctionArgs) {
  return formAction && ["/login", "/signup", "logout"].includes(formAction);
}

*/
