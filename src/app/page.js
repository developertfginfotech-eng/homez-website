import Home_V4 from "./(home)/home-v4/page";
import Wrapper from "./layout-wrapper/wrapper";

export const metadata = {
  title: "Globperty - Real Estate NextJS Template",
};

export default function MainRoot() {
  return (
    <Wrapper>
      <Home_V4 />
    </Wrapper>
  );
}
