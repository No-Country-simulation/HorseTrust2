"use client"

import { Search, MessageCircle, Star, FileCheck, Stethoscope, UserCheck, Trophy, Check } from "lucide-react";
import PropositoItem from "./PropositoItem"
import { useReveal } from "@/hooks/useReveal";
import ProcesoItem from "./ProcesoItem";
import VerificationItem from "./VerificationItem";
import PasosItem from "./PasosItem";
import DudaItem from "./DudaItem";
import PublicationItems from "./PublicationItem";
import Link from "next/link";

export default function ComoFuncionaContainer(){
    useReveal()
    const stylesTitle = "fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-cream))] uppercase"
    
    return (
        <>
            <section className="fontMontserrat h-[70vh] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-[rgb(var(--color-teal)/0.6)] to-[rgb(var(--color-terracota)/0.6)]">
                <div className="absolute top-0 left-0 w-full h-full hero-overlay"></div>
                
                <div className="relative z-10 text-center max-w-4xl px-8">
                    <div className="text-xs tracking-[0.375em] text-[rgb(var(--color-gold))] mb-6 uppercase font-normal opacity-0 animate-fade-in-up" style={{animationDelay: "0.3s", animationFillMode: "forwards"}}>
                        — Tu Guía Completa —
                    </div>
                    <h1 className="fontCormorant text-6xl lg:text-7xl xl:text-8xl text-[rgb(var(--color-cream))] tracking-[0.125em] mb-8 leading-tight uppercase opacity-0 animate-fade-in-up hero-title" style={{animationDelay: "0.6s", animationFillMode: "forwards"}}>
                        Cómo<br />Funciona
                    </h1>
                    <p className="text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed text-[rgb(var(--color-cream)/0.8)] opacity-0 animate-fade-in-up" style={{animationDelay: "0.9s", animationFillMode: "forwards"}}>
                        Descubrí cómo Horse Trust conecta compradores y vendedores de caballos 
                        con total transparencia y seguridad
                    </p>
                </div>
            </section>

            <section className="fontMontserrat py-24 px-8 lg:px-16 bg-[rgb(var(--color-cream))] text-black reveal">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-[1px] w-16 bg-[rgb(var(--color-gold))]"></div>
                        <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                        <div className="h-[1px] w-16 bg-[rgb(var(--color-gold))]"></div>
                    </div>
                    
                    <h2 className="fontCormorant text-4xl lg:text-5xl font-normal tracking-wide text-[rgb(var(--color-terracota))] uppercase mb-6">
                        Nuestro Propósito
                    </h2>
                    
                    <p className="text-lg font-light leading-relaxed text-black/80 mb-8 max-w-3xl mx-auto">
                        Horse Trust es la <strong className="font-medium text-[rgb(var(--color-teal))]">plataforma líder en Argentina</strong> 
                        que conecta compradores y vendedores de caballos de sangre pura. No somos intermediarios en la venta, 
                        somos tu <strong className="font-medium text-[rgb(var(--color-teal))]">aliado de confianza</strong> que garantiza transparencia, 
                        verificación y seguridad en cada transacción.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <PropositoItem icon={Search} title="Verificación Total" description="Validamos cada detalle: pedigrí, documentación médica y reputación del vendedor" />
                        <PropositoItem icon={MessageCircle} title="Conexión Directa" description="Comunicación segura entre comprador y vendedor sin intermediarios" />
                        <PropositoItem icon={Star} title="Sistema de Reseñas" description="Transparencia total con reputación verificada de cada vendedor" />
                    </div>
                </div>
            </section>

            <section className="fontMontserrat py-24 px-8 lg:px-16 bg-black reveal">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase font-medium">
                            Proceso Simple en 3 Pasos
                        </div>
                        <h2 className={stylesTitle} >
                            Tu Camino hacia<br />el Caballo Ideal
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                        <ProcesoItem color="gold" nro={1} title="Explorá" description="Navegá por nuestra colección de caballos verificados. Usá filtros avanzados para buscar por categoría, ubicación, precio y características específicas." items={["Fotos y videos de alta calidad", "Información detallada y completa", "Documentación médica verificada", "Certificados de pedigrí validados"]} />
                        <ProcesoItem color="teal" nro={2} title="Conectá" description="Usá nuestro sistema de mensajería seguro para contactar directamente al vendedor. 
                        Consultá sus reseñas y reputación antes de coordinar una visita." items={["Chat seguro y privado", "Sistema de reseñas transparente", "Perfil del vendedor verificado", "Historial de ventas visible"]} />
                        <ProcesoItem color="gold" nro={3} title="Comprá Seguro" description="Coordiná la visita, evaluá el caballo en persona y cerrá la operación directamente 
                        con el vendedor. Nuestra verificación previa te garantiza tranquilidad." items={["Trato directo sin comisiones", "Documentación validada previamente", "Sistema de mediación disponible", "Deja tu reseña post-compra"]} />                        
                    </div>
                </div>
            </section>

            <section className="fontMontserrat py-24 px-8 lg:px-16 bg-gradient-to-br from-[rgb(var(--color-teal))] to-black reveal">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase font-medium">
                            Sistema de Confianza
                        </div>
                        <h2 className={stylesTitle}>
                            Verificación<br />Exhaustiva
                        </h2>
                        <p className="text-lg font-light text-[rgb(var(--color-cream)/0.8)] max-w-3xl mx-auto leading-relaxed pt-6">
                            Cada caballo y vendedor pasa por nuestro riguroso proceso de verificación antes 
                            de ser publicado en la plataforma
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <VerificationItem icon={FileCheck} title="Certificación de Pedigrí" description="Validamos la autenticidad del pedigrí con instituciones oficiales como AACPS, verificando linaje completo y registros actualizados." />
                        <VerificationItem icon={Stethoscope} title="Revisión Veterinaria" description="Nuestros veterinarios especializados revisan certificados de salud, historial médico, vacunaciones y radiografías cuando están disponibles." />
                        <VerificationItem icon={UserCheck} title="Identidad del Vendedor" description="Verificamos identidad, ubicación y datos de contacto de cada vendedor.Solo perfiles completos y verificados pueden publicar." />
                        <VerificationItem icon={Trophy} title="Sistema de Reputación" description="Cada transacción genera reseñas bidireccionales. Los vendedores con mal historial son removidos de la plataforma automáticamente." />

                    </div>

                    <div className="mt-16 bg-[rgb(var(--color-gold)/0.1)] border-2 border-[rgb(var(--color-gold))]/40 p-8 text-center">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Check width={35} height={35} className="text-[rgb(var(--color-gold))] text-5xl mt-2">✓</Check>
                            <h3 className="fontCormorant text-3xl text-[rgb(var(--color-gold))] uppercase">100% Verificado</h3>
                        </div>
                        <p className="text-base font-light text-[rgb(var(--color-cream)/0.8)] max-w-2xl mx-auto">
                            Ningún caballo aparece en nuestra plataforma sin pasar por este proceso completo. 
                            Tu seguridad es nuestra prioridad.
                        </p>
                    </div>
                </div>
            </section>

            <section className="fontMontserrat py-24 px-8 lg:px-16 bg-[rgb(var(--color-cream))] text-black reveal">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-teal))] mb-4 uppercase font-medium">
                                Para Vendedores
                            </div>
                            <h2 className="fontCormorant text-5xl lg:text-6xl font-normal tracking-wide text-[rgb(var(--color-terracota))] uppercase mb-6">
                                Publicá tu<br />Caballo
                            </h2>
                            <p className="text-lg font-light leading-relaxed text-black/80 mb-8">
                                ¿Tenés un caballo para vender? Creá tu perfil verificado, publicá con toda 
                                la documentación y conectá con compradores serios que buscan exactamente 
                                lo que ofrecés.
                            </p>

                            <div className="space-y-4 mb-8">
                                <PublicationItems title="Perfil con reputación" description="Construí tu credibilidad con reseñas verificadas" />
                                <PublicationItems title="Alcance internacional" description="Conectá con compradores de toda Latinoamérica" />
                                <PublicationItems title="Soporte dedicado" description="Te ayudamos en cada paso del proceso" />
    
                            </div>

                            <Link href="/register" className="inline-block px-12 py-4 bg-[rgb(var(--color-teal))] text-[rgb(var(--color-cream))] text-xs tracking-[0.125em] uppercase font-medium hover:bg-[rgb(var(--color-terracota))] transition-all duration-300">
                                Comenzar a Vender
                            </Link>
                        </div>

                        <div className="space-y-6">
                            <PasosItem nro={1} title="Creá tu Perfil" description="Registrate y verificá tu identidad. Completá tu perfil con información relevante sobre tu experiencia ecuestre." />
                            <PasosItem nro={2} title="Publicá tu Caballo" description="Subí fotos, videos y toda la documentación. Nuestro equipo la verificará antes de publicar." />
                            <PasosItem nro={3} title="Recibí Consultas" description="Compradores interesados te contactarán por chat. Coordiná visitas y cerrá la venta directamente." />

                        </div>
                    </div>
                </div>
            </section>

            <section className="fontMontserrat py-24 px-8 lg:px-16 bg-black reveal">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase font-medium">
                            Preguntas Frecuentes
                        </div>
                        <h2 className={stylesTitle}>
                            ¿Tenés Dudas?
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <DudaItem title="¿HorseTrust vende caballos directamente?" description="No. HorseTrust es una plataforma que conecta compradores y vendedores. La negociación y el acuerdo final se realizan directamente entre las partes, pero brindamos herramientas para que el proceso sea más seguro y transparente." />
                        <DudaItem title="¿Cómo se verifica la información de los caballos publicados?" description="Cada publicación debe incluir datos detallados (edad, raza, estado de salud, ubicación, fotos reales, etc.). Además, promovemos la validación documental y recomendamos realizar revisión veterinaria antes de concretar la compra." />
                        <DudaItem title="¿Puedo ver el caballo antes de comprar?" description="¡Por supuesto! Recomendamos siempre visitar al caballo en persona antes de cerrar cualquier operación. Usá nuestro chat para coordinar la visita directamente con el vendedor." />
                        <DudaItem title="¿Es seguro realizar una compra a través de la plataforma?" description="HorseTrust promueve prácticas seguras, comunicación transparente y acuerdos formales entre las partes. Recomendamos siempre verificar identidad, documentación y estado sanitario antes de cerrar la operación." />
                        <DudaItem title="¿Qué tipo de caballos puedo encontrar en HorseTrust?" description="Podés encontrar caballos deportivos, de trabajo, de cría o recreativos, de distintas razas y edades. La plataforma permite filtrar por características específicas para facilitar la búsqueda." />
                        
                    </div>
                </div>
            </section>

            <section className="fontMontserrat py-32 px-8 lg:px-16 bg-gradient-to-br from-[rgb(var(--color-terracota))] to-black text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]" style={{background: "radial-gradient(circle, rgba(181, 186, 114, 0.1) 0%, transparent 70%)"}}></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="fontCormorant text-4xl lg:text-6xl text-[rgb(var(--color-cream))] tracking-[0.25em] mb-8 uppercase">
                        ¿Listo para<br />Comenzar?
                    </h2>
                    <p className="text-lg font-light tracking-wide mb-12 leading-relaxed text-[rgb(var(--color-cream)/0.8)]">
                        Explorá nuestra colección de caballos verificados o creá tu cuenta 
                        para comenzar a vender hoy mismo.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/gallery" className="inline-block px-12 py-5 text-xs tracking-[0.1875em] uppercase no-underline transition-all duration-400 font-medium bg-[rgb(var(--color-gold))] text-black   hover:bg-[rgb(var(--color-cream))] hover:-translate-y-2">
                            Explorar Caballos
                        </Link>
                        <Link href="/register" className="inline-block px-12 py-5 text-xs tracking-[0.1875em] uppercase no-underline transition-all duration-400 font-medium bg-transparent border-2 border-[rgb(var(--color-cream))] text-[rgb(var(--color-cream))]   hover:bg-[rgb(var(--color-cream))] hover:text-black">
                            Publicar mi Caballo
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}