import {
    ChevronLeft,
    ExternalLink,
    ShieldCheck,
    Key,
    Database,
    Clock,
    Globe,
    Settings,
    Copy
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';

export default function DomainDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/domains"
                    className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-gray-900"
                >
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">google.com</h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {params.id}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm">
                        Suspend Domain
                    </button>
                    <button className="px-4 py-2 bg-green-600 border border-green-600 rounded-lg text-sm font-semibold text-white hover:bg-green-700 shadow-sm shadow-green-100">
                        Domain Settings
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Stats & Info */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Status</span>
                            <StatusBadge status="active" />
                        </div>
                        <div className="space-y-4">
                            <DetailItem label="Mailboxes" value="45 / 100" />
                            <DetailItem label="Total Quota" value="50 GB" />
                            <DetailItem label="Used Storage" value="12.5 GB (25%)" />
                            <DetailItem label="Created At" value="Dec 12, 2025" />
                            <DetailItem label="Aliases" value="12" />
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-500">QUOTA MONITOR</span>
                                <span className="text-green-600 font-mono">75% REMAINING</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl space-y-4 text-white">
                        <h3 className="font-bold flex items-center gap-2">
                            <Settings size={18} className="text-green-400" />
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">Generate DKIM Record</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors">Force Sync Mailcow</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium transition-colors text-red-400">Flush Mail Queue</button>
                        </div>
                    </div>
                </div>

                {/* Right Column - DNS & DKIM */}
                <div className="lg:col-span-2 space-y-6">
                    {/* DNS Records Table */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Globe size={18} className="text-blue-500" />
                                Required DNS Records
                            </h2>
                            <StatusBadge status="valid" />
                        </div>
                        <div className="p-0">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Host</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">Value / Data</th>
                                        <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase">TTL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-mono text-xs">
                                    <DNSRow type="MX" host="@" value="mx1.ksamail.sa" ttl="3600" />
                                    <DNSRow type="MX" host="@" value="mx2.ksamail.sa" ttl="3600" />
                                    <DNSRow type="TXT" host="@" value="v=spf1 include:ksamail.sa ~all" ttl="3600" />
                                    <DNSRow type="TXT" host="_dmarc" value="v=DMARC1; p=quarantine" ttl="3600" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* DKIM Key Preview */}
                    <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <Key size={18} className="text-amber-500" />
                                DKIM Signature Key
                            </h2>
                            <button className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                <Copy size={14} />
                                Copy All
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Add this TXT record to your domain's DNS settings to authenticate outgoing emails.
                        </p>
                        <div className="group relative">
                            <pre className="bg-gray-50 p-6 rounded-xl border border-gray-100 font-mono text-[10px] text-gray-600 overflow-x-auto break-all whitespace-pre-wrap leading-loose">
                                v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7pU3vG8o1m3n...{"\n"}
                                ...p2uX0v3kL1u2k3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l...{"\n"}
                                ...9pX1v3kL1u2k3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l1k2u3l...{"\n"}
                                ...AQAB
                            </pre>
                            <div className="hidden group-hover:block absolute top-2 right-2 px-2 py-1 bg-gray-900 text-white text-[9px] rounded font-bold shadow-xl">
                                RSA 2048 BIT KEY
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-400">{label}</span>
            <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
    );
}

function DNSRow({ type, host, value, ttl }: any) {
    return (
        <tr className="hover:bg-gray-50/50">
            <td className="px-6 py-4 font-bold text-blue-600">{type}</td>
            <td className="px-6 py-4 text-gray-500">{host}</td>
            <td className="px-6 py-4 text-gray-800 break-all">{value}</td>
            <td className="px-6 py-4 text-gray-400">{ttl}</td>
        </tr>
    );
}
