# Pre-calculating aggregate values

This repo is a MarkLogic project that demonstrates pre-calculating an
aggregate value and keeping it up to date.

# Broad Approach

The technique shown here uses triggers to update the aggregates. Every time an
inventory record gets updated, the trigger fires and we re-calculate the
target aggregate value. In this case, I'm just updating a single "available"
property, but we could calculate multiple aggregates at the same time.

# Motivation

For many cases, this may be overkill, but if you have a large data set and want
to support sorting by an aggregate value, you might run into performance
problems. By pre-computing the aggregate values, they don't need to be computed
at query time.

Here's an example: consider a case where we're supporting a paged Optic query
with raw data in the milllions or tens of millions of rows. We need to support
sorting by an aggregate value. We could try brute-forcing this -- at query time,
use any query criteria to reduce the number of rows, run the aggregates on all
that remain, then apply paging. What this means in practice is that we're
computing aggregate values for many rows that won't show up in the requested
page of results.

By pre-computing these values, we save a lot of computation and we can
dramatically improve query performance time.

# Caveats and Challenges

Sounds good so far; what are the challenges with this approach?

Triggers can fire either pre- or post-commit. A pre-commit trigger would have
the advantage of making the aggregate update happen with the updates to the
triggering data. I went with post-commit triggers because for the client that
inspired this investigation, updates to the triggering data are often happening
in batches. That means that multiple updates could happen to the aggregate data
in a single transaction, causing conflicting updates.

Post-commit triggers prevent that problem. The potential downsides:

- there will be a very brief, but non-zero, time gap between an update to the
  triggering data and the aggregate update;
- if an error happens in the trigger itself, the aggregate will get out of date.

An enhancement to the approach shown here is to include the timestamp of when
each source's values were updated. That will make it easier to track down
problems should any occur.
