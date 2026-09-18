import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);       // desktop default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setOpen(!mobile);                          // desktop: open, mobile: closed
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobile && open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, open]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile, toggle: () => setOpen(!open) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);