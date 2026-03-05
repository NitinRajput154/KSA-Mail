import Header from "@/components/Header/Header";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main style={{ paddingTop: '80px' }}>
                {children}
            </main>
        </>
    );
}
