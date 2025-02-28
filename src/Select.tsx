// src/components/Select.tsx
import React, { useEffect, useState } from "react";
import {
    passwordlessManageCheck,
    joinPasswordless,
    callApi,
    getOneTimeToken,
    getServicePassword,
} from "./passwordlessApiService";
import useWebSocket from "./useWebSocket";

type Mode = "join" | "login";

const Select: React.FC = () => {
    const [mode, setMode] = useState<Mode>("join");
    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");
    const [token, setToken] = useState("");
    const [joinQR, setJoinQR] = useState("");
    const [servicePassword, setServicePassword] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [wsUrl, setWsUrl] = useState("");
    const [wsToken, setWsToken] = useState("");

    useWebSocket({
        url: wsUrl,
        token: wsToken,
        onMessage: async (data) => {
            if (data.type === "result") {
                await checkStatus();
            }
        },
    });

    useEffect(() => {
        setId("");
        setPwd("");
        setJoinQR("");
        setServicePassword("");
        setWsUrl("");
        setWsToken("");
        setSessionId("");
    }, [mode]);

    const checkStatus = async () => {
        try {
            const params =
                mode === "join"
                    ? { url: "isApUrl", params: `userId=${id}&QRReg=T&token=${token}` }
                    : { url: "resultUrl", params: `userId=${id}&sessionId=${sessionId}` };

            const response = await callApi(params.url, params.params);
            if (response.data.result === "OK") {
                alert(
                    mode === "join"
                        ? "Passwordless 등록이 완료되었습니다."
                        : "로그인이 완료되었습니다."
                );
            }
        } catch (error) {
            console.error("상태 확인 오류:", error);
        }
    };

    const handleJoin = async () => {
        try {
            const manageRes = await passwordlessManageCheck(id, pwd);
            const PasswordlessToken = manageRes.data.PasswordlessToken;
            setToken(PasswordlessToken);

            const joinRes = await joinPasswordless(id, PasswordlessToken);
            const jsonRes = JSON.parse(joinRes.data.data);

            setJoinQR(jsonRes.data.qr);
            setWsUrl(jsonRes.data.pushConnectorUrl);
            setWsToken(jsonRes.data.pushConnectorToken);
        } catch (error) {
            console.error("등록 중 오류:", error);
        }
    };

    const handleLogin = async () => {
        try {
            const oneTimeRes = await getOneTimeToken(id);
            const oneTimeToken = oneTimeRes.data.oneTimeToken;
            setToken(oneTimeToken);

            const spRes = await getServicePassword(id, oneTimeToken);
            const spData = JSON.parse(spRes.data.data);

            setWsToken(spData.data.pushConnectorToken);
            setWsUrl(spData.data.pushConnectorUrl);
            setServicePassword(spData.data.servicePassword);
            setSessionId(spRes.data.sessionId);
        } catch (error) {
            console.error("로그인 중 오류:", error);
        }
    };

    return (
        <div>
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                <option value="join">Join</option>
                <option value="login">Login</option>
            </select>
            {mode === "join" ? (
                <div>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력"
                    />
                    <br />
                    <input
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="비밀번호를 입력"
                    />
                    <button onClick={handleJoin}>등록하기</button>
                    <br />
                    {joinQR && <img src={joinQR} alt="QR 코드" />}
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="아이디를 입력"
                    />
                    <button onClick={handleLogin}>로그인</button>
                    <br />
                    {servicePassword && <h2>{servicePassword}</h2>}
                </div>
            )}
        </div>
    );
};

export default Select;
