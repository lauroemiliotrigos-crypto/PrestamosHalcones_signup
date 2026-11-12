"use client";
import Link from "next/link";
import { useState } from "react";
import { firebaseAuth } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";

type AuthFormProps = { mode: "login" | "signup" };

export default function AuthForm({ mode }: AuthFormProps) {
  const esRegistro = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const labelClass = "block text-sm text-[#195aec] font-bold mb-1.5";
  const inputClass =
    "w-full rounded-lg border-[#195aec] bg-[#195aec]/10 px-4 py-3 text-sm text-black transition focus:border-[#2935cc] focus:ring-2 focus:ring-[#195aec]/50 outline-none";

  async function sendForm(event: React.FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();

    if (esRegistro && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      if (esRegistro) {
        const resultado = await createUserWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password,
        );
        await updateProfile(resultado.user, {
          displayName: name.trim(),
        });
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log("Error de Firebase: ", error);
      setError(
        esRegistro
          ? "No se pudo crear la cuenta. Revisa los datos o el correo."
          : "No se pudo iniciar sesión. Revisa tus credenciales.",
      );
    }
    console.log({
      modo: mode,
      name: esRegistro ? name : undefined,
      email: email,
      password: password,
    });
  }

  return (
    <form className="space-y-5" onSubmit={sendForm}>
      {/* CAMPO: NOMBRE COMPLETO */}
      {esRegistro && (
        <div>
          <label htmlFor="nombre" className={labelClass}>
            Nombre Completo
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#195aec]">
              person
            </span>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Tu nombre completo"
              className={`${inputClass} pl-10`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* CAMPO: CORREO ELECTRÓNICO (Corregido visualmente) */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Correo electrónico
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#195aec]">
            mail
          </span>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            required
            className={`${inputClass} pl-10`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* CAMPO: CONTRASEÑA */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="password"
            className={labelClass}
            style={{ marginBottom: 0 }}
          >
            Contraseña
          </label>
          {!esRegistro && (
            <Link
              href="#"
              className="text-xs text-[#fb7000] hover:underline font-semibold"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </div>

        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#195aec]">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            required
            className={`${inputClass} pl-10 pr-10`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#195aec] hover:opacity-75 focus:outline-none transition-opacity"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>

      {/* CAMPO: CONFIRMAR CONTRASEÑA */}
      {esRegistro && (
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#195aec]">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="**********"
              required
              className={`${inputClass} pl-10 pr-10`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#195aec] hover:opacity-75 focus:outline-none transition-opacity"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span className="material-symbols-outlined">
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* CHECKBOX (Del código original del profe) */}
      {!esRegistro && (
        <div className="flex items-center gap-2 pt-1">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-[#195aec] text-[#195aec] focus:ring-[#195aec] cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-sm text-gray-700 cursor-pointer font-medium"
          >
            Mantener sesión activa
          </label>
        </div>
      )}

      {/* CAJA DE ERROR */}
      {error && (
        <p className="text-red-600 text-sm font-bold bg-red-100 p-2 rounded-md border border-red-300">
          {error}
        </p>
      )}

      {/* BOTÓN DE ENVÍO */}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#00ab00] px-4 py-3 font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
      >
        <span>{esRegistro ? "Crear cuenta" : "Iniciar sesión"}</span>
        <span className="material-symbols-outlined text-xl">
          {esRegistro ? "person_add" : "arrow_forward"}
        </span>
      </button>

      {/* ENLACE PARA CAMBIAR DE PÁGINA */}
      {esRegistro && (
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-700">¿Ya tienes cuenta? </span>
          <Link
            href="/login"
            className="font-bold text-[#195aec] hover:underline transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </div>
      )}
    </form>
  );
}
