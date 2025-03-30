import { Header } from "order/header";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

export const Profile: FC = () => {
  const form = useForm({ resolver: zodResolver(z.object({ type: z.number() })) });

  return (
    <div>
      <Header />
      <h1>Profile</h1>

      <form onSubmit={form.handleSubmit(console.log, console.error)}>
        <input {...form.register("type")} />

        <button type="submit">xD</button>
      </form>
    </div>
  );
};
