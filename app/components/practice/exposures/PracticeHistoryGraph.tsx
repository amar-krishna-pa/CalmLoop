"use client";

import { useId } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PracticeAttempt } from "@/app/lib/zod/practice-attempt-schema";

type Props = { attempts: PracticeAttempt[] };

const RATINGS = [0, 2, 4, 6, 8, 10];

export default function PracticeHistoryGraph({ attempts }: Props) {
  const chartId = useId();

  if (attempts.length === 0) return null;

  // The attempts API returns records in completion-time order.
  const points = attempts.map((attempt) => ({
    ...attempt,
    completedAt: new Date(attempt.completedAt).getTime(),
  }));
  const timestamps = points.map((point) => point.completedAt);
  const firstTime = Math.min(...timestamps);
  const lastTime = Math.max(...timestamps);

  const timeDomain =
    firstTime === lastTime
      ? // Center  a single saved attempt.
        [firstTime - 60_000, lastTime + 60_000]
      : [firstTime, lastTime];

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-primary">
        After-practice distress over time
      </figcaption>

      <p id={`${chartId}-description`} className="sr-only">
        Each point represents a saved practice attempt on a 0–10 distress scale.
        Completion time runs from left to right. Exact ratings and times appear
        in the practice history.
      </p>

      <ResponsiveContainer width="100%" height={240} minWidth={0}>
        <LineChart
          data={points}
          margin={{ top: 12, right: 8, bottom: 8, left: 0 }}
          accessibilityLayer
          aria-label="After-practice distress over time"
          aria-describedby={`${chartId}-description`}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border-subtle)"
            syncWithTicks
          />

          <XAxis
            dataKey="completedAt"
            type="number"
            scale="time"
            domain={timeDomain}
            padding={{ left: 16, right: 16 }}
            ticks={firstTime === lastTime ? [firstTime] : undefined}
            tickCount={5}
            tickFormatter={(timestamp) =>
              new Date(timestamp).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                ...(new Date(firstTime).getFullYear() !==
                  new Date(lastTime).getFullYear() && { year: "numeric" }),
              })
            }
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
            tickMargin={12}
            height={36}
          />

          <YAxis
            domain={[0, 10]}
            ticks={RATINGS}
            padding={{ top: 8, bottom: 8 }}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            width={32}
          />

          <Tooltip
            labelFormatter={(timestamp) =>
              new Date(Number(timestamp)).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }
            formatter={(rating) => `${rating}/10`}
            contentStyle={{
              backgroundColor: "var(--bg-modal)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--text-muted)" }}
            itemStyle={{ color: "var(--text-primary)" }}
            cursor={{ stroke: "var(--border-subtle)" }}
            isAnimationActive={true}
          />

          <Line
            dataKey="suds"
            name="After-practice distress"
            type="linear"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "var(--accent)", strokeWidth: 0 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </figure>
  );
}
