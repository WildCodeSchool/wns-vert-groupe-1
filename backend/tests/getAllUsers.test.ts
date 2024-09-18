import { describe, expect, it, jest } from "@jest/globals";
import { UserResolver } from "../src/resolvers/User";
import { User, UserRole, City } from "../src/entities";

describe("UserResolver", () => {
	describe("getAllUsers", () => {
		it("should return all users for ADMIN role", async () => {
			const mockAdmin = new User();
			mockAdmin.email = "admin@example.com";
			mockAdmin.role = UserRole.ADMIN;

			const mockUser1 = new User();
			mockUser1.email = "user1@example.com";

			const mockUser2 = new User();
			mockUser2.email = "user2@example.com";

			jest.spyOn(User, "findOneByOrFail").mockResolvedValue(mockAdmin);
			jest
				.spyOn(User, "find")
				.mockResolvedValue([mockAdmin, mockUser1, mockUser2]);

			const resolver = new UserResolver();
			const ctx = { role: UserRole.ADMIN, email: "admin@example.com" };
			const result = await resolver.getAllUsers(ctx);

			expect(result).toEqual([mockAdmin, mockUser1, mockUser2]);
		});

		it("should return users from the same city for CITYADMIN role", async () => {
			const mockCity = new City();
			mockCity.id = 1;

			const mockCity2 = new City();
			mockCity.id = 2;

			const mockCityAdmin = new User();
			mockCityAdmin.email = "cityadmin@example.com";
			mockCityAdmin.role = UserRole.CITYADMIN;
			mockCityAdmin.city = mockCity;

			const mockUser1 = new User();
			mockUser1.email = "user1@example.com";
			mockUser1.city = mockCity;

			const mockUser2 = new User();
			mockUser2.email = "user2@example.com";
			mockUser2.city = mockCity;

			const mockUser3 = new User();
			mockUser3.email = "user3@example.com";
			mockUser3.city = mockCity2;

			jest.spyOn(User, "findOneByOrFail").mockResolvedValue(mockCityAdmin);
			jest
				.spyOn(User, "find")
				.mockResolvedValue([mockCityAdmin, mockUser1, mockUser2]);

			const resolver = new UserResolver();
			const ctx = { role: UserRole.CITYADMIN, email: "cityadmin@example.com" };
			const result = await resolver.getAllUsers(ctx);

			expect(result).toEqual([mockCityAdmin, mockUser1, mockUser2]);
		});
	});
});
