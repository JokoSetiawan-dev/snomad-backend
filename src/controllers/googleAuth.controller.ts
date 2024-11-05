import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user";
import Store from "../models/store";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class GoogleAuthController {
  public initializeGoogleStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          callbackURL:
            "https://e061-2001-448a-1041-88d4-a817-8836-1a98-d657.ngrok-free.app/auth/google/callback",
          passReqToCallback: true, // Allows us to pass the state parameter
        },
        this.googleStrategyCallback.bind(this)
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  private async googleStrategyCallback(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ) {
    try {
      // Retrieve the role from the state parameter (from frontend)
      const { role } = req.query.state
        ? JSON.parse(req.query.state as string)
        : { role: "" };
      if (!role) {
        return done(new Error("Role is required"), undefined);
      }

      // Check if the user already exists
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          role, // Assign the role from frontend
        });
      } else if (user.role !== role) {
        // Update the role if it has changed
        user.role = role;
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error as Error, undefined);
    }
  }

  public authenticateGoogle(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const role = (req.query.role as string) || "buyer"; // Fetch the role from query parameter, default to "buyer"

    // Pass the role as part of the "state" parameter
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: JSON.stringify({ role }), // Convert role to JSON string for OAuth state
    })(req, res, next);
  }

  public async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate("google", { failureRedirect: "/login" })(
      req,
      res,
      async (err: any) => {
        if (err) return next(err);

        const user = req.user as any;

        // Check if user has an associated store (for sellers)
        const store = await Store.findOne({ owner: user._id });

        try {
          // Generate Access Token
          const accessToken = jwt.sign(
            {
              id: user._id,
              role: user.role,
              store: store
                ? {
                    storeId: store._id,
                    name: store.name,
                  }
                : null,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "15m" }
          );

          // Generate Refresh Token
          const refreshToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_REFRESH_KEY as string,
            { expiresIn: "7d" }
          );

          // Save refresh token to the user record
          user.refreshToken = refreshToken;
          await user.save();

          // Decide how to respond based on your frontend
          if (req.headers["content-type"] === "application/json") {
            // For API response
            return res.status(201).json({
              message: "User registered successfully",
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
              },
              accessToken,
              refreshToken,
            });
          } else {
            // For cookie-based response
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 15 * 60 * 1000,
              sameSite: "strict",
            });

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 7 * 24 * 60 * 60 * 1000,
              sameSite: "strict",
            });

            return res.redirect(
              `exp://192.168.1.7:8081/`
            );
          }
        } catch (tokenError) {
          console.error("Token generation error:", tokenError);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    );
  }
}

export default new GoogleAuthController();
