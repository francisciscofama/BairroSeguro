import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  HeartPulse,
  House,
  MapPin,
  MessageCircle,
  Plus,
  Shield,
  ShieldAlert,
  Smartphone,
  Trash2,
  UserRound,
  UsersRound,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import Login from "./login";
import LocationMap from "@/components/LocationMap.tsx";

type View = "entry" | "home" | "form" | "sent" | "tracking" | "requests" | "profile";
type RequestKind = "Segurança" | "Saúde" | "Ajuda comunitária" | "Ocorrência no bairro";
type TrustedContact = { id: string; name: string; phone: string };

const requestOptions: { title: RequestKind; detail: string; icon: typeof Shield }[] = [
  { title: "Segurança", detail: "Perigo ou situação urgente", icon: ShieldAlert },
  { title: "Saúde", detail: "Precisa de assistência médica", icon: HeartPulse },
  { title: "Ajuda comunitária", detail: "Apoio a um morador", icon: UsersRound },
  { title: "Ocorrência no bairro", detail: "Iluminação, buracos ou inundação", icon: Wrench },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bairro Seguro — Apoio comunitário" },
      {
        name: "description",
        content: "Interfaces móveis de segurança, saúde e assistência comunitária, Luanda.",
      },
      { property: "og:title", content: "Bairro Seguro — Apoio comunitário" },
      {
        property: "og:description",
        content:
          "Interfaces móveis de segurança, saúde e assistência comunitária no Bairro Mundial, Luanda.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BairroSeguro,
});

function BairroSeguro() {
  const [view, setView] = useState<View>("entry");
  const [kind, setKind] = useState<RequestKind>("Segurança");
  const [description, setDescription] = useState("");
  const [shareLocation, setShareLocation] = useState(false);
  const [requestNumber, setRequestNumber] = useState<string | null>(null);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);

  function startRequest(nextKind: RequestKind) {
    setKind(nextKind);
    setDescription("");
    setShareLocation(false);
    setView("form");
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestNumber(`BS-${Math.floor(1000 + Math.random() * 9000)}`);
    setView("sent");
  }

  function sendHelpAlert() {
    setKind("Segurança");
    setRequestNumber(`BS-${Math.floor(1000 + Math.random() * 9000)}`);
    setView("sent");
  }

  const back = () => setView("home");

  if (view === "entry") {
    return (
      <Login
        onSubmit={(event) => {
          event.preventDefault();
          setView("home");
        }}
      />
    );
  }
  return (
    <main className="resident-app mx-auto min-h-screen w-full max-w-[520px] bg-background pb-24 text-foreground">
      <div className="px-5 pt-4 sm:px-7">
        <header className="mb-5 flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logótipo Bairro Seguro"
              className="size-10 shrink-0 object-contain"
            />
            <div>
              <p className="font-heading text-sm font-bold leading-tight">Bairro Seguro</p>
              <p className="mt-1 text-[9px] font-semibold uppercase text-muted-foreground">
                Segurança comunitária
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("profile")}
            aria-label="Abrir perfil"
          >
            <UserRound className="size-5" />
          </Button>
        </header>

        {view === "home" && (
          <Home
            onRequest={startRequest}
            onHelp={sendHelpAlert}
            onProfile={() => setView("profile")}
          />
        )}
        {view === "form" && (
          <RequestForm
            kind={kind}
            description={description}
            shareLocation={shareLocation}
            onDescriptionChange={setDescription}
            onShareLocationChange={setShareLocation}
            onBack={back}
            onSubmit={submitRequest}
          />
        )}
        {view === "sent" && (
          <RequestSent
            kind={kind}
            number={requestNumber}
            onHome={back}
            onTrack={() => setView("tracking")}
          />
        )}
        {view === "tracking" && (
          <Tracking number={requestNumber} kind={kind} onBack={() => setView("requests")} />
        )}
        {view === "requests" && (
          <Requests
            kind={kind}
            number={requestNumber}
            onBack={back}
            onTrack={() => setView("tracking")}
            onRequest={() => startRequest("Segurança")}
          />
        )}
        {view === "profile" && (
          <Profile
            onBack={back}
            contacts={trustedContacts}
            onAddContact={(contact) => setTrustedContacts((current) => [...current, contact])}
            onRemoveContact={(id) =>
              setTrustedContacts((current) => current.filter((contact) => contact.id !== id))
            }
          />
        )}
      </div>

      <BottomNavigation
        active={
          view === "requests" || view === "tracking" || view === "sent"
            ? "requests"
            : view === "profile"
              ? "profile"
              : "home"
        }
        onHome={back}
        onRequests={() => setView("requests")}
        onProfile={() => setView("profile")}
      />
    </main>
  );
}

function Home({
  onRequest,
  onHelp,
  onProfile,
}: {
  onRequest: (kind: RequestKind) => void;
  onHelp: () => void;
  onProfile: () => void;
}) {
  return (
    <section className="screen-arrive" aria-label="Início">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          <span>Angola · Segura</span>
        </div>
      </div>

      <section className="mb-7" aria-labelledby="emergency-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="emergency-title" className="font-heading text-base font-semibold">
            Precisa de ajuda?
          </h2>
        </div>

        <div className="mb-6 rounded-lg border border-emergency/4 bg-card px-5 py-6 text-center">
          <button
            type="button"
            onClick={onHelp}
            className="mx-auto mb-4 block size-64 overflow-hidden rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emergency/30"
            aria-label="Pedir ajuda de emergência"
          >
            <img
              src="/imagens/sos.png"
              alt="SOS - Pedir ajuda de emergência"
              className="size-full object-contain"
            />
          </button>

          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
            Toque no botão SOS para pedir ajuda.
          </p>
        </div>

        <h2 className="mb-3 font-heading text-sm font-semibold uppercase text-muted-foreground">
          Outros pedidos de ajuda
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {requestOptions
            .filter(({ title }) => title !== "Segurança")
            .map(({ title, detail, icon: Icon }) => (
              <Button
                key={title}
                variant="outline"
                className="h-auto min-h-28 flex-col items-start justify-between gap-3 whitespace-normal rounded-md border bg-card p-4 text-left shadow-none hover:border-primary/50 hover:bg-surface-green"
                onClick={() => onRequest(title)}
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="block w-full">
                  <span className="block text-sm font-bold leading-snug">{title}</span>
                  <span className="mt-1 block text-xs font-normal leading-snug text-muted-foreground">
                    {detail}
                  </span>
                </span>
              </Button>
            ))}
        </div>
      </section>

      <section className="border-t border-border py-5" aria-labelledby="safety-title">
        <LocationMap />
      </section>
    </section>
  );
}

function PageHeading({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  return (
    <header className="mb-7">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-3 mb-4 px-3 text-muted-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Button>
      <h1 className="font-heading text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
    </header>
  );
}

function RequestForm({
  kind,
  description,
  shareLocation,
  onDescriptionChange,
  onShareLocationChange,
  onBack,
  onSubmit,
}: {
  kind: RequestKind;
  description: string;
  shareLocation: boolean;
  onDescriptionChange: (value: string) => void;
  onShareLocationChange: (value: boolean) => void;
  onBack: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const selected = requestOptions.find((item) => item.title === kind);
  if (!selected) {
    return null;
  }
  const Icon = selected.icon;

  return (
    <section className="screen-arrive" aria-label={`Pedido de ${kind}`}>
      <PageHeading title={kind} subtitle={selected.detail} onBack={onBack} />
      <div className="mb-6 flex items-center gap-3 rounded-md bg-surface-green p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-card text-primary">
          <Icon className="size-5" />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Descreva brevemente o que está a acontecer. Não inclua dados sensíveis desnecessários.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block text-sm font-semibold" htmlFor="request-description">
          O que aconteceu?
          <textarea
            id="request-description"
            required
            minLength={5}
            maxLength={500}
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Escreva aqui os detalhes principais…"
            className="mt-2 min-h-32 w-full resize-y rounded-md border border-input bg-card px-3 py-3 text-sm font-normal text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="mt-1 block text-right text-xs font-normal text-muted-foreground">
            {description.length}/500
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-4">
          <input
            type="checkbox"
            checked={shareLocation}
            onChange={(event) => onShareLocationChange(event.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" /> Partilhar a minha localização
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
              Opcional. A localização só deve ser partilhada com a sua autorização.
            </span>
          </span>
        </label>
        <Button type="submit" className="h-12 w-full text-base font-bold">
          Registar pedido <ArrowRight className="size-4" />
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Demonstração: este botão não contacta serviços de emergência nem uma central.
        </p>
      </form>
    </section>
  );
}

function RequestSent({
  kind,
  number,
  onHome,
  onTrack,
}: {
  kind: RequestKind;
  number: string | null;
  onHome: () => void;
  onTrack: () => void;
}) {
  return (
    <section
      className="screen-arrive flex min-h-[70vh] flex-col items-center justify-center text-center"
      aria-label="Pedido registado"
    >
      <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-status-soft text-status">
        <Check className="size-8" />
      </div>
      <h1 className="font-heading text-2xl font-bold">
        {kind === "Segurança" ? "Pedido de ajuda registado" : "Pedido registado"}
      </h1>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {kind === "Segurança"
          ? "O envio de alertas aos contactos ainda não está ligado."
          : `O pedido de ${kind.toLowerCase()} foi registado apenas neste protótipo. Não foi enviado a uma central.`}
      </p>
      {kind !== "Segurança" && number && (
        <p className="mt-5 rounded-md bg-muted px-4 py-2 font-mono text-sm font-semibold">
          Referência {number}
        </p>
      )}
      {kind !== "Segurança" && (
        <Button onClick={onTrack} className="mt-7 h-12 w-full max-w-xs">
          Ver acompanhamento <ArrowRight />
        </Button>
      )}
      <Button onClick={onHome} variant="ghost" className="mt-2">
        Voltar ao início
      </Button>
    </section>
  );
}

function Tracking({
  number,
  kind,
  onBack,
}: {
  number: string | null;
  kind: RequestKind;
  onBack: () => void;
}) {
  return (
    <section className="screen-arrive" aria-label="Acompanhamento do pedido">
      <PageHeading
        title="Acompanhamento"
        subtitle="Estado do pedido neste protótipo"
        onBack={onBack}
      />
      <div className="mb-6 rounded-md border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Pedido de</p>
            <p className="mt-1 font-semibold">{kind}</p>
          </div>
          {number && <span className="font-mono text-xs text-muted-foreground">{number}</span>}
        </div>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-status-soft px-3 py-1.5 text-xs font-bold text-status">
          <span className="size-2 rounded-full bg-status" /> Registado no protótipo
        </span>
      </div>
      <ol className="space-y-0" aria-label="Etapas do pedido">
        <TimelineItem title="Pedido registado" detail="Apenas neste protótipo visual" active />
        <TimelineItem title="Em verificação" detail="Etapa ilustrativa · não iniciada" />
        <TimelineItem title="Encaminhado" detail="Depende de protocolos locais confirmados" />
        <TimelineItem title="Resolvido" detail="Etapa ilustrativa" last />
      </ol>
      <div className="mt-6 rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        Nenhum operador está a acompanhar este pedido. Os canais de resposta serão definidos com os
        parceiros do projecto-piloto.
      </div>
    </section>
  );
}

function TimelineItem({
  title,
  detail,
  active = false,
  last = false,
}: {
  title: string;
  detail: string;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <li className="flex min-h-20 gap-3">
      <div className="flex w-5 shrink-0 flex-col items-center">
        <span
          className={`mt-1 flex size-5 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "border-2 border-border bg-background"}`}
        >
          {active && <Check className="size-3" />}
        </span>
        {!last && <span className="min-h-8 w-px flex-1 bg-border" />}
      </div>
      <div className="pb-4">
        <p
          className={`text-sm font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}
        >
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}

function Requests({
  kind,
  number,
  onBack,
  onTrack,
  onRequest,
}: {
  kind: RequestKind;
  number: string | null;
  onBack: () => void;
  onTrack: () => void;
  onRequest: () => void;
}) {
  return (
    <section className="screen-arrive" aria-label="Os meus pedidos">
      <PageHeading
        title="Os meus pedidos"
        subtitle="Acompanhe os pedidos registados neste dispositivo"
        onBack={onBack}
      />
      {number ? (
        <Button
          variant="outline"
          type="button"
          onClick={onTrack}
          className="h-auto w-full justify-start gap-3 whitespace-normal rounded-md bg-card p-4 text-left shadow-none hover:bg-muted"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-status-soft text-status">
            <ClipboardList className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{kind}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {number} · Registado no protótipo
            </span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Button>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <ClipboardList className="size-6" />
          </div>
          <h2 className="font-heading text-lg font-semibold">Ainda sem pedidos</h2>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Os pedidos criados neste protótipo aparecerão aqui.
          </p>
          <Button variant="outline" className="mt-5" onClick={onRequest}>
            Criar pedido de demonstração
          </Button>
        </div>
      )}
    </section>
  );
}

function Profile({
  onBack,
  contacts,
  onAddContact,
  onRemoveContact,
}: {
  onBack: () => void;
  contacts: TrustedContact[];
  onAddContact: (contact: TrustedContact) => void;
  onRemoveContact: (id: string) => void;
}) {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  function addContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = contactName.trim();
    const phone = contactPhone.trim();
    if (!name || !phone) return;
    onAddContact({ id: crypto.randomUUID(), name, phone });
    setContactName("");
    setContactPhone("");
  }

  return (
    <section className="screen-arrive" aria-label="Perfil">
      <PageHeading
        title="O meu perfil"
        subtitle="Informações de contacto e pessoas de confiança"
        onBack={onBack}
      />
      <div className="mb-6 flex items-center gap-4 rounded-md bg-surface-green p-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <UserRound className="size-7" />
        </div>
        <div>
          <h2 className="font-heading text-base font-bold">Francisco Afonso</h2>
          <p className="mt-1 text-sm text-muted-foreground">Morador · Bairro Mundial</p>
        </div>
      </div>
      <div className="divide-y divide-border border-y border-border">
        <ProfileRow label="Telefone" value="Não definido" />
        <ProfileRow label="Localização" value="Partilha apenas com autorização" />
      </div>
      <section className="mt-6" aria-labelledby="trusted-contacts-title">
        <h2 id="trusted-contacts-title" className="font-heading text-base font-semibold">
          Contactos de confiança
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Adicione pessoas que gostaria de indicar como contacto.
        </p>
        <form onSubmit={addContact} className="mt-4 space-y-3">
          <label className="block text-sm font-semibold" htmlFor="trusted-contact-name">
            Nome
            <input
              id="trusted-contact-name"
              required
              maxLength={80}
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="Nome do contacto"
              className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block text-sm font-semibold" htmlFor="trusted-contact-phone">
            Telefone
            <input
              id="trusted-contact-phone"
              required
              type="tel"
              autoComplete="tel"
              maxLength={30}
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              placeholder="Número de telemóvel"
              className="mt-1.5 h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-normal text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <Button type="submit" className="w-full">
            <Plus className="size-4" /> Adicionar contacto
          </Button>
        </form>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {contacts.length === 0 ? (
            <li className="py-4 text-sm text-muted-foreground">
              Ainda não há contactos adicionados.
            </li>
          ) : (
            contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{contact.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {contact.phone}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remover ${contact.name}`}
                  onClick={() => onRemoveContact(contact.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))
          )}
        </ul>
        <p className="mt-3 rounded-md bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
          Os contactos ficam apenas nesta sessão de demonstração. Não recebem alertas.
        </p>
      </section>
      <div className="mt-6 rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        Os dados pessoais e de saúde exigem protecção e acesso restrito. Este perfil é apenas
        ilustrativo.
      </div>
      <Button variant="outline" className="mt-5 w-full" disabled>
        Editar perfil
      </Button>
    </section>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-56 text-right text-sm font-semibold">{value}</span>
    </div>
  );
}

function BottomNavigation({
  active,
  onHome,
  onRequests,
  onProfile,
}: {
  active: "home" | "requests" | "profile";
  onHome: () => void;
  onRequests: () => void;
  onProfile: () => void;
}) {
  const links = [
    { id: "home" as const, label: "Início", icon: House, onClick: onHome },
    { id: "requests" as const, label: "Pedidos", icon: ClipboardList, onClick: onRequests },
    { id: "profile" as const, label: "Perfil", icon: UserRound, onClick: onProfile },
  ];
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto grid w-full max-w-[520px] grid-cols-3 border-t border-border bg-card/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur"
    >
      {links.map(({ id, label, icon: Icon, onClick }) => (
        <Button
          key={id}
          variant="ghost"
          onClick={onClick}
          aria-current={active === id ? "page" : undefined}
          className={`h-14 flex-col gap-1 rounded-md text-xs ${active === id ? "text-primary" : "text-muted-foreground"}`}
        >
          <Icon className="size-5" aria-hidden="true" />
          <span>{label}</span>
        </Button>
      ))}
    </nav>
  );
}
