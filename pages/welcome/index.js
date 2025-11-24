"use client";
import { Button } from "@/components/ui/button";
import connectToDB from "@/configs/db";
import { verifyRefreshToken, verifyToken } from "@/lib/utils";
import usersModel from "@/models/users";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const LoggedOutHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-b-accent ">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center self-start max-h-[100px]">
      <div className="flex items-center">
        <Image
          width={150}
          height={140}
          src={"/images/logo.png"}
          className="object-cover w-[140px] h-[180px]"
          alt="logo"
        />
      </div>
      <nav className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-muted-foreground ">
          Our story
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Membership
        </Link>
        <Link href="/editor" className="hover:text-muted-foreground ">
          Write
        </Link>
        <Link href="/auth" className="hover:text-muted-foreground">
          Sign in
        </Link>
        <Button
          asChild
          className="rounded-full "
        >
          <Link href="/auth">Get started</Link>
        </Button>
      </nav>
      <div className="md:hidden">
        <Button
          asChild
          className="rounded-full "
        >
          <Link href="/auth">Get started</Link>
        </Button>
      </div>
    </div>
  </header>
);

const LoggedOutFooter = () => (
  <footer className=" border-t border-accent">
    <div className="container mx-auto px-6 pt-8 pb-3 flex justify-center items-center">
      <div className="flex flex-wrap justify-center space-x-6 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-muted-foreground ">
          Help
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Status
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          About
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Careers
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Press
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Blog
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Privacy
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Terms
        </Link>
        <Link href="#" className="hover:text-muted-foreground ">
          Text to speech
        </Link>
      </div>
    </div>
  </footer>
);

export default function WelcomePage() {
  return (
    <div className="  min-h-screen flex flex-col">
      <LoggedOutHeader />
      <main className="flex-grow flex items-center">
        <div className="w-11/12 mx-auto px-6 grid md:grid-cols-2 items-center gap-8">
          <div className="space-y-6">
            <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tighter !leading-[1.1]">
              Human stories & ideas
            </h1>
            <p className="text-xl md:text-2xl  font-sans">
              A place to read, write, and deepen your understanding
            </p>
            <Button asChild size="lg" className="rounded-full ">
              <Link href="/auth">Start reading</Link>
            </Button>
          </div>
          <div className="hidden md:block relative">
            <svg
              viewBox="0 0 550 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <g fill="#34A853">
                <path d="M266.393 54.1953C268.433 55.4753 269.813 57.5953 269.973 60.0353C270.213 63.3953 268.733 66.5153 266.093 68.4753C263.533 70.3553 260.133 70.7953 256.973 69.6353C253.813 68.4753 251.573 65.8353 250.933 62.5953C250.213 58.9153 251.493 55.0753 254.453 52.8353C257.413 50.5953 261.453 50.4753 264.733 52.1953L266.393 54.1953Z" />
                <path d="M305.626 24.0792C309.456 27.8292 310.746 33.7158 309.716 39.3592C308.559 45.7492 304.466 51.0892 298.716 53.3992C292.966 55.7092 286.396 54.7492 281.359 51.0092C276.323 47.2592 274.079 41.2092 275.109 35.5658C276.049 30.3492 279.799 25.5492 285.236 23.3592C290.673 21.1692 296.866 21.6792 301.986 25.1092L305.626 24.0792Z" />
                <path d="M229.845 28.5292C233.178 30.9892 235.345 34.6192 235.595 38.6792C235.928 44.2092 233.928 49.3992 230.178 53.2392C226.595 56.9092 221.758 58.9525 216.595 58.9525C210.635 58.9525 205.158 56.4092 201.328 51.8292C197.498 47.2492 196.208 41.3625 197.238 35.7192C198.395 29.3292 202.488 23.9892 208.238 21.6792C213.988 19.3692 220.558 20.3292 225.595 24.0792L229.845 28.5292Z" />
                <path d="M216.595 105.783C221.935 105.783 226.735 103.656 230.315 99.8562C233.895 96.0562 235.935 91.0762 235.935 85.7362C235.935 80.3962 233.895 75.4162 230.315 71.6162C226.735 67.8162 221.935 65.6895 216.595 65.6895C211.255 65.6895 206.455 67.8162 202.875 71.6162C199.295 75.4162 197.255 80.3962 197.255 85.7362C197.255 91.0762 199.295 96.0562 202.875 99.8562C206.455 103.656 211.255 105.783 216.595 105.783Z" />
                <path d="M269.215 85.7362C269.215 91.0762 267.175 96.0562 263.595 99.8562C260.015 103.656 255.215 105.783 249.875 105.783C244.535 105.783 239.735 103.656 236.155 99.8562C232.575 96.0562 230.535 91.0762 230.535 85.7362C230.535 80.3962 232.575 75.4162 236.155 71.6162C239.735 67.8162 244.535 65.6895 249.875 65.6895C255.215 65.6895 260.015 67.8162 263.595 71.6162C267.175 75.4162 269.215 80.3962 269.215 85.7362Z" />
              </g>
              <path
                d="M473 242L478.788 238.48L474.225 233.917L473 242ZM418.5 242.5L418.354 243.485L418.5 243.5L418.646 243.485L418.5 242.5ZM371 205L370.827 204.02L370.071 204.417L370.015 205.34L371 205ZM439.5 197.5L439.485 196.501L438.832 196.51L438.528 197.042L439.5 197.5ZM478.537 207.958L477.565 208.331L478.537 207.958ZM430.5 160.5L429.528 160.042L429.168 160.832L429.515 161.499L430.5 160.5ZM473.015 241.34L473.5 240.5L473.015 241.34ZM418.646 241.515L419.5 242L418.646 241.515ZM472.083 246.225L473 242L472.083 246.225ZM474.225 233.917L418.354 241.515L418.646 243.485L474.579 235.883L474.225 233.917ZM371.173 205.98L418.673 242.98L418.327 242.02L370.827 204.02L371.173 205.98ZM370.015 205.34L370.015 242.34L372.015 242.34L372.015 205.34L370.015 205.34ZM439.515 198.499L478.537 207.958L479.463 206.14L440.485 196.501L439.515 198.499ZM478.354 206.515L478.788 238.48L480.788 238.32L480.354 206.32L478.354 206.515ZM430.5 160.5C440.333 160.5 456.8 171.3 469 198.5L470.834 197.604C458.166 169.496 441 -1.49999 403 160.5L430.5 160.5ZM431.472 160.958C440.755 174.529 455.518 191.139 470.028 197.958L470.972 196.224C456.982 189.661 441.832 172.671 432.528 159.042L431.472 160.958ZM429.515 161.499L439.485 198.499L441.485 197.501L431.485 160.501L429.515 161.499ZM372 205L430.5 160.5L429.5 159.5L371 204L372 205ZM371.985 242.34C387.668 242.34 403.015 231.84 418.354 242.485L418.646 242.515C403.315 231.84 387.834 242.34 371.985 242.34L371.985 242.34ZM418.5 241.5C434.333 241.5 454.1 247.1 472.083 246.225L472.271 244.241C454.811 245.077 434.667 239.5 418.5 239.5L418.5 241.5ZM477.262 238.646L477.565 208.331L479.565 208.489L479.262 238.804L477.262 238.646ZM473.5 240.5C474.9 240.5 476.55 239.5 477.262 238.646L479.262 238.804C479.95 241.304 477.5 242.5 475.5 242.5L473.5 240.5ZM474.579 235.883C478.112 235.017 480.368 237.119 480.788 238.32L478.788 238.48C478.683 238.168 477.554 236.937 474.225 237.751L474.579 235.883ZM473 242L473.5 242.5L475.5 242.5L475 242L473 242ZM472.083 246.225C473.537 246.157 475.054 245.225 476.225 243.725L474.775 242.475C474.013 243.437 473.091 244.093 472.271 244.241L472.083 246.225ZM479.463 206.14C479.807 206.417 479.525 207.825 478.354 208.485L480.354 206.32C481.921 205.424 482.029 202.838 478.537 201.279L479.463 206.14Z"
                stroke="#34A853"
                stroke-width="2"
              />
              <rect x="371" y="242" width="102" height="113" fill="#34A853" />
              <path
                d="M433.844 265.11C427.883 268.289 420.351 269.458 413.43 268.455C402.04 266.822 393.435 259.043 389.922 248.81C388.948 245.96 388.665 242.868 389.141 239.889C389.814 235.794 391.737 232.062 394.619 229.18C398.991 224.808 405.074 222.253 411.399 222.022C419.866 221.699 427.645 224.791 433.017 230.163L433.844 265.11Z"
                stroke="#F2F2F2"
                stroke-width="2"
              />
              <path
                d="M433.844 265.11L466.5 321.5"
                stroke="#F2F2F2"
                stroke-width="2"
              />
              <path d="M430 365L473 355" stroke="#F2F2F2" stroke-width="2" />
              <g fill="#F2F2F2">
                <path d="M435.5 289.5L438.5 293.5L431 298L435.5 289.5Z" />
                <path d="M401 321L404.5 324.5L396.5 329.5L401 321Z" />
                <path d="M380 292L383 296L375.5 300.5L380 292Z" />
                <path d="M410.344 278.344L413.344 282.344L405.844 286.844L410.344 278.344Z" />
                <path d="M448.5 326.5L451.5 330.5L444 335L448.5 326.5Z" />
                <path d="M459.5 303.5L462.5 307.5L455 312L459.5 303.5Z" />
                <path d="M394 265L397 269L389.5 273.5L394 265Z" />
              </g>
            </svg>
          </div>
        </div>
      </main>
      <LoggedOutFooter />
    </div>
  );
}
export async function getServerSideProps(context) {
  await connectToDB();

  try {
    const { token, refreshToken } = context.req.cookies;

    const validToken = verifyToken(token);
    const validRefreshToken = verifyRefreshToken(refreshToken);
    if (validToken || validRefreshToken) {
      const currentUser = await usersModel.findOne({
        email: validToken.email || validRefreshToken.email,
      });
      if (currentUser) {
        return {
          redirect: {
            destination: "/",
          },
        };
      }
    }
    return { props: {} };
  } catch (error) {
    return {
      props: {},
    };
  }
}
