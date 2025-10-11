"use server";

export async function generateQuestion(params) {
    const { lc_session, csrftoken, difficulties } = params || {};

    const difficulty = Array.isArray(difficulties) && difficulties.length > 0
        ? difficulties[Math.floor(Math.random() * difficulties.length)]
        : undefined;

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/problems`);
    if (difficulty) url.searchParams.append('difficulty', difficulty);
    if (lc_session) url.searchParams.append('session', lc_session);
    if (csrftoken) url.searchParams.append('csrftoken', csrftoken);

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await res.json();
    const questions = data?.problemsetQuestionList?.questions || data?.problemsetQuestionList || [];
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions found');
    }

    const filteredQuestions = questions.filter((item) => item.isPaidOnly === false && item.status !== 'ac');
    const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    return randomQuestion;
}