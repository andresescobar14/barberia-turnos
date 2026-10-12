'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { supabase } from '../supabase';

const SERVICIOS = [
  { id: 'corte', nombre: 'Corte Clásico', precio: '$250' },
  { id: 'barba', nombre: 'Arreglo de Barba', precio: '$180' },
  { id: 'combo', nombre: 'Corte + Barba', precio: '$400' },
  { id: 'afeitado', nombre: 'Afeitado con Toalla Caliente', precio: '$220' },
  { id: 'premium', nombre: 'Experiencia Premium', precio: '$600' },
];

type FormData = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
};

const FORM_INICIAL: FormData = {
  nombre: '',
  telefono: '',
  servicio: '',
  fecha: '',
};

const inputClase =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900/80 px-4 py-3 text-neutral-100 placeholder-neutral-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30';

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState<FormData>(FORM_INICIAL);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((actual) => ({
      ...actual,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cargando) return;

    setCargando(true);

    try {
      const { error } = await supabase.from('turnos').insert({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        servicio: form.servicio,
        fecha: new Date(form.fecha).toISOString(),
      });

      if (error) throw error;

      setEnviado(true);
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      alert('Hubo un error al reservar. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setEnviado(false);

    setTimeout(() => {
      document
        .getElementById('reservas')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEnviado(false);
    setForm(FORM_INICIAL);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200">
      <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500 text-lg text-amber-500">
              ✂
            </span>
            <h1 className="text-xl font-semibold uppercase tracking-[0.3em] text-amber-500 sm:text-2xl">
              Royal Barber
            </h1>
          </div>

          <nav className="hidden gap-8 text-sm uppercase tracking-widest text-neutral-400 md:flex">
            <a href="#servicios" className="transition hover:text-amber-500">
              Servicios
            </a>
            <a href="#reservas" className="transition hover:text-amber-500">
              Reservas
            </a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-transparent to-neutral-950" />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.5em] text-amber-500/80">
            Desde 2010 · Tradición & Estilo
          </p>

          <h2 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            El arte del corte,{' '}
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              a otro nivel
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-400">
            Una experiencia de barbería premium donde cada detalle importa.
            Precisión, elegancia y atención personalizada.
          </p>

          <button
            type="button"
            onClick={abrirFormulario}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-neutral-950 shadow-lg shadow-amber-500/30 transition duration-300 hover:scale-105 hover:shadow-amber-500/50 active:scale-95"
          >
            Reservar turno ahora
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-500/80">
            Lo que ofrecemos
          </p>

          <h3 className="mt-3 text-3xl font-semibold text-white">
            Nuestros servicios
          </h3>

          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((servicio) => (
            <div
              key={servicio.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 transition hover:border-amber-500/50 hover:bg-neutral-900"
            >
              <span className="font-medium text-neutral-200">
                {servicio.nombre}
              </span>
              <span className="font-semibold text-amber-500">
                {servicio.precio}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="reservas" className="px-6 pb-24">
        <div
          className={`mx-auto max-w-xl overflow-hidden transition-all duration-700 ease-out ${
            mostrarFormulario
              ? 'max-h-[1000px] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 translate-y-10 opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-amber-500/30 bg-neutral-900/90 p-8 shadow-2xl shadow-black/60 backdrop-blur">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  Reserva tu turno
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Completa tus datos y te confirmaremos.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
                className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-amber-500"
              >
                ✕
              </button>
            </div>

            {enviado ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 text-3xl text-amber-500">
                  ✓
                </div>

                <h4 className="text-xl font-semibold text-white">
                  ¡Reserva recibida!
                </h4>

                <p className="mt-2 text-neutral-400">
                  Gracias, {form.nombre}. Tu reserva se ha guardado
                  correctamente.
                </p>

                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="mt-6 rounded-full border border-amber-500 px-6 py-2 text-sm uppercase tracking-widest text-amber-500 transition hover:bg-amber-500 hover:text-neutral-950"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-xs uppercase tracking-widest text-neutral-400"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className={inputClase}
                    placeholder="Tu nombre completo"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-xs uppercase tracking-widest text-neutral-400"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={25}
                    className={inputClase}
                    placeholder="Ej: +52 55 1234 5678"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="servicio"
                    className="mb-2 block text-xs uppercase tracking-widest text-neutral-400"
                  >
                    Servicio
                  </label>

                  <select
                    id="servicio"
                    name="servicio"
                    required
                    className={inputClase}
                    value={form.servicio}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un servicio</option>
                    {SERVICIOS.map((servicio) => (
                      <option key={servicio.id} value={servicio.nombre}>
                        {servicio.nombre} — {servicio.precio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fecha"
                    className="mb-2 block text-xs uppercase tracking-widest text-neutral-400"
                  >
                    Fecha y hora
                  </label>

                  <input
                    id="fecha"
                    name="fecha"
                    type="datetime-local"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className={inputClase}
                    value={form.fecha}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-neutral-950 shadow-lg shadow-amber-500/20 transition hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cargando ? 'Guardando reserva...' : 'Confirmar reserva'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}