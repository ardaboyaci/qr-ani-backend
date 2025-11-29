'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, QrCode, Trash2, Save, Lock, Unlock, Calendar, MapPin, User, Link as LinkIcon } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useForm } from 'react-hook-form'

interface Event {
    id: number
    couple_name: string
    wedding_date: string
    venue_name: string
    slug: string
    password?: string | null
}

interface SettingsFormData {
    couple_name: string
    wedding_date: string
    venue_name: string
    is_password_enabled: boolean
    password: string
}

export function SettingsForm({ event }: { event: Event }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const { register, handleSubmit, watch, formState: { errors } } = useForm<SettingsFormData>({
        defaultValues: {
            couple_name: event.couple_name,
            wedding_date: event.wedding_date ? new Date(new Date(event.wedding_date).getTime() - (new Date(event.wedding_date).getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : '',
            venue_name: event.venue_name,
            is_password_enabled: !!event.password,
            password: event.password || '',
        }
    })

    const isPasswordEnabled = watch('is_password_enabled')

    const onSubmit = async (data: SettingsFormData) => {
        setLoading(true)

        const updates = {
            couple_name: data.couple_name,
            wedding_date: data.wedding_date,
            venue_name: data.venue_name,
            password: data.is_password_enabled ? data.password : null,
        }

        const { error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', event.id)

        if (error) {
            toast.error('Güncelleme başarısız: ' + error.message)
        } else {
            toast.success('Ayarlar başarıyla güncellendi')
            router.refresh()
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('BU ETKİNLİĞİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ? Bu işlem geri alınamaz ve tüm fotoğraflar silinir.')) return

        setLoading(true)
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', event.id)

        if (error) {
            toast.error('Silme işlemi başarısız')
            setLoading(false)
        } else {
            toast.success('Etkinlik silindi')
            router.push('/dashboard')
        }
    }

    const publicUrl = `${window.location.origin}/event/${event.slug}`

    const downloadQR = () => {
        const svg = document.getElementById("event-qr")
        if (!svg) return
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL("image/png")
            const downloadLink = document.createElement("a")
            downloadLink.download = `qr-${event.slug}.png`
            downloadLink.href = pngFile
            downloadLink.click()
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    return (
        <div className="space-y-8">
            {/* Event Details Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Save className="w-5 h-5 text-emerald-600" />
                    Etkinlik Detayları
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Çift İsimleri
                            </label>
                            <input
                                {...register('couple_name', { required: 'Çift isimleri zorunludur' })}
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                                placeholder="Ayşe & Ahmet"
                            />
                            {errors.couple_name && <p className="text-sm text-red-500">{errors.couple_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                Tarih
                            </label>
                            <input
                                {...register('wedding_date', { required: 'Tarih zorunludur' })}
                                type="datetime-local"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                            />
                            {errors.wedding_date && <p className="text-sm text-red-500">{errors.wedding_date.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            Mekan
                        </label>
                        <input
                            {...register('venue_name', { required: 'Mekan adı zorunludur' })}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                            placeholder="Grand Hotel Balo Salonu"
                        />
                        {errors.venue_name && <p className="text-sm text-red-500">{errors.venue_name.message}</p>}
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                {isPasswordEnabled ? <Lock className="w-5 h-5 text-emerald-600" /> : <Unlock className="w-5 h-5 text-gray-400" />}
                                Şifre Koruması
                            </h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    {...register('is_password_enabled')}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        {isPasswordEnabled && (
                            <div className="animate-in slide-in-from-top-2 fade-in duration-300 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Misafir Şifresi</label>
                                <input
                                    {...register('password', { required: isPasswordEnabled ? 'Şifre zorunludur' : false })}
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Örn: 1234"
                                />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Bu şifreyi misafirlerinizle paylaşmalısınız.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>

            {/* QR Code Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    QR Kod & Bağlantı
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <QRCodeSVG
                            id="event-qr"
                            value={publicUrl}
                            size={200}
                            level="H"
                            includeMargin
                        />
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                Etkinlik Linki
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={publicUrl}
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(publicUrl)
                                        toast.success('Link kopyalandı')
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                                >
                                    Kopyala
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={downloadQR}
                            className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <QrCode className="w-4 h-4" />
                            QR Kodu İndir (PNG)
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Tehlikeli Bölge
                </h2>
                <p className="text-red-600 mb-6 text-sm">
                    Bu etkinliği silmek tüm fotoğrafları, beğenileri ve verileri kalıcı olarak silecektir. Bu işlem geri alınamaz.
                </p>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                >
                    Etkinliği Sil
                </button>
            </div>
        </div>
    )
}
