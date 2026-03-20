import Feedback from "../models/Feedback.js";
import Session from "../models/Session.js";

export async function submitFeedback(req, res) {
  try {
    const { sessionid, rating, review } = req.body;
    const userId = req.user._id;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const session = await Session.findById(sessionid);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // ✅ Ensure session completed
    if (session.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Session not completed yet" });
    }

    // ✅ Ensure user is part of session
    const isHost = session.host.toString() === userId.toString();
    const isParticipant =
      session.participant &&
      session.participant.toString() === userId.toString();

    if (!isHost && !isParticipant) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // ✅ Prevent duplicate feedback
    const existing = await Feedback.findOne({
      session: sessionid,
      givenBy: userId,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Feedback already submitted" });
    }

    // ✅ Decide who receives feedback
    let givenTo = null;

    if (isHost && session.participant) {
      givenTo = session.participant;
    } else if (isParticipant) {
      givenTo = session.host;
    }

    if (!givenTo) {
      return res
        .status(400)
        .json({ message: "No user to give feedback to" });
    }

    const feedback = await Feedback.create({
      session: sessionid,
      givenBy: userId,
      givenTo,
      rating,
      review,
    });

    res.status(201).json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function checkFeedback(req, res) {
  const { sessionid } = req.params;
  const userId = req.user._id;

  const existing = await Feedback.findOne({
    session: sessionid,
    givenBy: userId,
  });

  res.json({ alreadyGiven: !!existing });
}