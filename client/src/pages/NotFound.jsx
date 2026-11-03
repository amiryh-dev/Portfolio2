import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageIntro } from "../components/Layout";
export default function NotFound() {
  return (
    <section className="min-h-[65vh]">
      <PageIntro
        number="404"
        eyebrow="PAGE NOT FOUND"
        title={
          <>
            A small detour.
            <br />
            <span>Let’s head back.</span>
          </>
        }
      >
        This page doesn’t exist. You can explore my work or return to the
        homepage.
      </PageIntro>
      <Link to="/" className="button-primary">
        <ArrowLeft size={18} />
        Back to home
      </Link>
    </section>
  );
}
