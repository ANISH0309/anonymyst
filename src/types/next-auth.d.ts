import "next-auth";
import { DefaultSession } from "./../../node_modules/next-auth/core/types.d";

declare module "next-auth" {
	interface Session {
		user: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingMessages?: boolean;
			username?: string;
		} & DefaultSession["user"];
	}
	interface User {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}
}
