import { useEffect, useState, type FormEvent } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { usePostDetailStore } from "../store/usePostDetailStore";
import { useAuthStore } from "../store/useAuthStore";
import { relativeTime } from "../helper/timeFormat";
import type { Comment } from "../types";

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { post, status, error, fetchPost, reset, clearError } =
    usePostDetailStore();

  useEffect(() => {
    if (id) void fetchPost(id);
    return () => reset();
  }, [id, fetchPost, reset]);

  if (status === "loading" || status === "idle") {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "error" || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ?? "That story could not be found."}
        </Alert>
        <Link component={RouterLink} to="/forum">
          Back to forum
        </Link>
      </Container>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
        textAlign: "left",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Link
            component={RouterLink}
            to="/forum"
            underline="hover"
            color="text.secondary"
            sx={{
              width: "fit-content",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 14,
            }}
          >
            <ArrowBackOutlinedIcon fontSize="small" />
            Back to forum
          </Link>

          {error && (
            <Alert severity="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box
            component="article"
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4.5 },
              border: 1,
              borderColor: "divider",
              borderRadius: "2px",
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, lineHeight: 1.1 }}
            >
              {post.title}
            </Typography>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 2.5, flexWrap: "wrap", alignItems: "center" }}
            >
              <Avatar
                src={post.authorAvatarUrl ?? undefined}
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: 14,
                  color: "primary.main",
                  backgroundColor: "rgba(31, 138, 112, 0.10)",
                }}
              >
                {post.authorName.charAt(0).toUpperCase()}
              </Avatar>

              <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                By {post.authorName} -{" "}
                {new Date(post.createdUtc).toLocaleDateString()}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center" }}
              >
                <BoltOutlinedIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    color: "primary.main",
                    fontSize: "1.1rem",
                  }}
                >
                  {post.energyCount}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                  energy
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 3.5 }} />

            <Typography
              sx={{
                textAlign: "left",
                whiteSpace: "pre-wrap",
                fontFamily: '"Newsreader", Georgia, serif',
                fontSize: { xs: "1.1rem", md: "1.2rem" },
                lineHeight: 1.85,
              }}
            >
              {post.body}
            </Typography>
          </Box>

          <Divider />

          <CommentSection />
        </Stack>
      </Container>
    </Box>
  );
}

function CommentSection() {
  const post = usePostDetailStore((state) => state.post);
  const comments = post?.comments ?? [];

  return (
    <Box component="section">
      <Typography variant="h2" sx={{ fontSize: "1.75rem", mb: 3 }}>
        {comments.length === 0
          ? "Comments"
          : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </Typography>

      {comments.length === 0 ? (
        <Typography color="text.secondary">
          No comments yet. Be the first to respond.
        </Typography>
      ) : (
        <Stack spacing={3} divider={<Divider />}>
          {comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 4 }} />

      <CommentComposer />
    </Box>
  );
}

function CommentComposer() {
  const { addComment, isSubmitting } = usePostDetailStore();
  const token = useAuthStore((state) => state.token);
  const [body, setBody] = useState("");

  if (!token) {
    return (
      <Alert severity="info">
        <Link component={RouterLink} to="/login">
          Sign in
        </Link>{" "}
        to join the conversation.
      </Alert>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    if (await addComment(body.trim())) setBody("");
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Share what you thought of this story..."
          value={body}
          onChange={(event) => setBody(event.target.value.slice(0, 1000))}
          slotProps={{ htmlInput: { "aria-label": "Your comment" } }}
        />

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography
            color="text.secondary"
            sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}
          >
            {body.length}/1000
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || !body.trim()}
            sx={{ minWidth: 140 }}
          >
            {isSubmitting ? "Posting..." : "Comment"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function CommentRow({ comment }: { comment: Comment }) {
  const deleteComment = usePostDetailStore((state) => state.deleteComment);
  const user = useAuthStore((state) => state.user);
  const isMine = user?.id === comment.authorId;

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        src={comment.authorAvatarUrl ?? undefined}
        sx={{
          width: 38,
          height: 38,
          fontSize: 15,
          flexShrink: 0,
          color: "primary.main",
          backgroundColor: "rgba(31, 138, 112, 0.10)",
        }}
      >
        {comment.authorName.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {comment.authorName}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            {relativeTime(comment.createdUtc)}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {isMine && (
            <IconButton
              size="small"
              aria-label="Delete comment"
              onClick={() => void deleteComment(comment.id)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Typography
          sx={{
            mt: 0.5,
            textAlign: "left",
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
          }}
        >
          {comment.body}
        </Typography>
      </Box>
    </Stack>
  );
}
