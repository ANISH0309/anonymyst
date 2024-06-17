import dbConnect from "@/lib/dbConenct";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
	username: usernameValidation,
});

export async function GET(request: Request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const queryParam = { username: searchParams.get("username") };

		// validate with zod
		const result = UsernameQuerySchema.safeParse(queryParam);
		console.log(result); //TODO: Remove

		if (!result.success) {
			const usernameErrors = result.error.format().username?._errors || [];
			return Response.json(
				{
					success: false,
					message:
						usernameErrors?.length > 0
							? usernameErrors.join(", ")
							: "Invalid username",
				},
				{
					status: 400,
				}
			);
		}

		const { username } = result.data;

		const existingVerifiedUser = await UserModel.findOne({
			username,
			isVerified: true,
		});

		if (existingVerifiedUser) {
			return Response.json(
				{
					success: false,
					message: "Username already exists",
				},
				{
					status: 400,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: "Username is unique",
			},
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("Failed to check username", error);
		return Response.json(
			{
				success: false,
				message: "Failed to check username",
			},
			{
				status: 500,
			}
		);
	}
}
