"use client"

import { useState } from "react"
import { FaLinkedinIn } from "react-icons/fa"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { publicTeamMembers, type TeamMemberProfile } from "@/data/teamMembers"
import { useLanguage } from "@/contexts/LanguageContext"

export interface TeamMember {
  id: string
  name: string
  role: string
  region: string
  image: string
  bio: string
  linkedin?: string
}

interface TeamShowcaseProps {
  members?: TeamMember[]
  /** Restrict the showcase to specific roster groups (e.g. just "Advisors"). Omit to include everyone. */
  groups?: TeamMemberProfile["group"][]
}

export function TeamShowcase({ members, groups }: TeamShowcaseProps) {
  const { t } = useLanguage()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const resolvedMembers: TeamMember[] =
    members ??
    publicTeamMembers
      .filter((member) => !groups || groups.includes(member.group))
      .map((member) => {
        const translated = t.team.members[member.id]
        return {
          id: member.id,
          name: member.name,
          role: translated?.title ?? member.publicRole,
          region: member.region,
          image: member.image,
          bio: translated?.bio ?? member.bio,
          linkedin: member.linkedin,
        }
      })

  const col1 = resolvedMembers.filter((_, i) => i % 3 === 0)
  const col2 = resolvedMembers.filter((_, i) => i % 3 === 1)
  const col3 = resolvedMembers.filter((_, i) => i % 3 === 2)

  return (
    <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24 select-none w-full max-w-6xl mx-auto">
      {/* Photo grid */}
      <div className="flex w-full max-w-full gap-3 overflow-x-auto pb-1 lg:sticky lg:top-28 lg:w-auto lg:flex-shrink-0 lg:pb-0">
        <div className="flex flex-col gap-3">
          {col1.map((m) => (
            <PhotoCard
              key={m.id}
              member={m}
              className="w-[130px] h-[150px] sm:w-[155px] sm:h-[178px] md:w-[180px] md:h-[206px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-[60px] sm:mt-[72px] md:mt-[85px]">
          {col2.map((m) => (
            <PhotoCard
              key={m.id}
              member={m}
              className="w-[142px] h-[162px] sm:w-[168px] sm:h-[192px] md:w-[196px] md:h-[224px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 mt-[30px] sm:mt-[36px] md:mt-[42px]">
          {col3.map((m) => (
            <PhotoCard
              key={m.id}
              member={m}
              className="w-[135px] h-[155px] sm:w-[160px] sm:h-[183px] md:w-[186px] md:h-[213px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* Name / info list */}
      <div className="flex flex-col gap-8 pt-0 lg:pt-6 flex-1 w-full">
        {resolvedMembers.map((m) => (
          <MemberRow
            key={m.id}
            member={m}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            expanded={expandedId === m.id}
            onToggleExpand={() =>
              setExpandedId((current) => (current === m.id ? null : m.id))
            }
            readMoreLabel={t.team.readMore}
            readLessLabel={t.team.readLess}
          />
        ))}
      </div>
    </div>
  )
}

function PhotoCard({
  member,
  className,
  hoveredId,
  onHover,
}: {
  member: TeamMember
  className: string
  hoveredId: string | null
  onHover: (id: string | null) => void
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive
  const initials = member.name
    .split(" ")
    .filter((part) => !["Dr.", "J."].includes(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
  const hash = member.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const tone = hash % 2 === 0 ? "135deg" : "45deg"

  return (
    <div
      className={cn(
        "overflow-hidden cursor-pointer flex-shrink-0 transition-opacity duration-400",
        className,
        isDimmed ? "opacity-50" : "opacity-100"
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        aria-label={member.name}
        role="img"
        className="relative w-full h-full transition-[filter] duration-500"
        style={{
          background:
            `linear-gradient(${tone}, rgba(200,169,106,0.20), rgba(16,24,39,0.95) 42%, rgba(59,130,246,0.14)), #101827`,
          filter: isActive
            ? "grayscale(0) brightness(1)"
            : "grayscale(1) brightness(0.65)",
        }}
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-serif text-[#F5F1E8]/85"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "0.08em" }}
            >
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[#070B14]/10 mix-blend-multiply" />
      </div>
    </div>
  )
}

function MemberRow({
  member,
  hoveredId,
  onHover,
  expanded,
  onToggleExpand,
  readMoreLabel,
  readLessLabel,
}: {
  member: TeamMember
  hoveredId: string | null
  onHover: (id: string | null) => void
  expanded: boolean
  onToggleExpand: () => void
  readMoreLabel: string
  readLessLabel: string
}) {
  const isActive = hoveredId === member.id
  const isDimmed = hoveredId !== null && !isActive
  // Long bios (mostly the intern-analyst group) get clamped by default so
  // the name list doesn't run far past the photo grid's height — expand on
  // demand instead of always rendering the full paragraph.
  const isLong = member.bio.length > 160

  return (
    <div
      className={cn(
        "transition-opacity duration-300",
        isDimmed ? "opacity-35" : "opacity-100"
      )}
      onMouseEnter={() => onHover(member.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3 cursor-pointer">
        {/* Accent bar */}
        <span
          className={cn(
            "h-px flex-shrink-0 transition-all duration-400",
            isActive ? "w-10 bg-[#C8A96A]" : "w-4 bg-[#C8A96A]/30"
          )}
        />
        {/* Name — Playfair Display */}
        <span
          className={cn(
            "font-display font-normal leading-none transition-colors duration-300",
            isActive ? "text-[#F5F1E8]" : "text-[#F5F1E8]/65"
          )}
          style={{ fontSize: "clamp(19px, 1.8vw, 24px)" }}
        >
          {member.name}
        </span>

        {/* LinkedIn */}
        {member.linkedin && (
          <div
            className={cn(
              "flex items-center gap-1.5 transition-all duration-200",
              isActive
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none"
            )}
          >
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 text-[#A8B0C0] hover:text-[#C8A96A] transition-colors duration-150"
              title="LinkedIn"
            >
              <FaLinkedinIn size={12} />
            </a>
          </div>
        )}
      </div>

      <div className="mt-2 pl-7 flex flex-col gap-1.5">
        <p
          className="text-[#C8A96A] font-sans font-medium uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.22em" }}
        >
          {member.role}
        </p>
        <p
          className={cn(
            "text-[#A8B0C0] font-sans font-light leading-[1.7]",
            isLong && !expanded && "line-clamp-2"
          )}
          style={{ fontSize: "13px" }}
        >
          {member.bio}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
            className="flex w-fit items-center gap-1 text-[#C8A96A]/80 hover:text-[#C8A96A] font-sans font-medium uppercase transition-colors cursor-pointer"
            style={{ fontSize: "9px", letterSpacing: "0.18em" }}
          >
            {expanded ? readLessLabel : readMoreLabel}
            <ChevronDown
              size={11}
              strokeWidth={2}
              className={cn("transition-transform duration-300", expanded && "rotate-180")}
            />
          </button>
        )}
        <p
          className="text-[#A8B0C0]/45 font-sans font-medium uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.2em" }}
        >
          {member.region}
        </p>
      </div>
    </div>
  )
}
