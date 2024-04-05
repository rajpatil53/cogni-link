"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="hero min-h-screen">
      <div className="container mx-auto ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Image
            width={400}
            height={400}
            src="/hero.webp"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Decentralized Collaborative Research and Innovation Platform"
          />
          <div>
            <h1 className="text-5xl font-bold">
              Unleash the Power of Decentralized Innovation!
            </h1>
            <p className="py-6">
              Welcome to CogniLink, where every voice matters - vote, comment,
              and directly fund groundbreaking projects. Whether you are
              publishing your latest paper or contributing to cutting-edge
              research, CogniLink is your gateway to pushing boundaries
              together.
            </p>
            <div className="flex gap-4">
              <a className="btn btn-primary" href="/projects">
                View Projects
              </a>
              <a className="btn btn-outline" href="/projects/new">
                Create A New Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
