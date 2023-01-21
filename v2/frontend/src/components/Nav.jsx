import { Navbar, Button, Tooltip } from "flowbite-react";

function Nav() {
  return (
    <Navbar className='max-w-[42rem] mx-auto mb-5 px-6 py-5 rounded'>
      <Navbar.Brand>
        <span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>Bilet Buldum</span>
      </Navbar.Brand>
      <div className='flex'>
        <Tooltip content='Henüz hazır değil' trigger='click'>
          <Button size={"xs"}>Giriş Yap</Button>
        </Tooltip>
      </div>
    </Navbar>
  );
}

export default Nav;
