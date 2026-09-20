package com.sharepresent.domain.curation.service;

import com.sharepresent.domain.curation.dto.AiMessageResponse;
import com.sharepresent.domain.curation.dto.GenerateAiMessageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiMessageAssistantService {

    public AiMessageResponse generateMessage(GenerateAiMessageRequest request) {
        String situation = request.getSituation() != null ? request.getSituation().toUpperCase() : "THANK_YOU";
        String tone = request.getTone() != null ? request.getTone().toUpperCase() : "EDITORIAL";
        String receiver = (request.getReceiverName() != null && !request.getReceiverName().isBlank()) 
                ? request.getReceiverName() : "소중한 분";
        String sender = (request.getSenderName() != null && !request.getSenderName().isBlank()) 
                ? request.getSenderName() : "보내는 이";
        String keyword = (request.getCustomKeyword() != null && !request.getCustomKeyword().isBlank()) 
                ? request.getCustomKeyword() : null;

        String mainMessage;
        List<String> alternatives;
        String recommendedTheme;
        String recommendedMonogram;
        String stylingTip;

        switch (situation) {
            case "BIRTHDAY":
                recommendedTheme = "rose";
                recommendedMonogram = "HBD";
                stylingTip = "화사한 로즈 테마와 HBD 모노그램 씰로 생일의 특별함을 더해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("%s님, 생일을 진심으로 축하해요! 🎂 태어나줘서 고맙고, 오늘 하루는 세상에서 가장 행복하고 따뜻한 순간들로만 가득 채워지길 바라요. %s",
                            receiver, keyword != null ? String.format("언제나 %s(으)로 빛나길 응원할게요 ✦", keyword) : "마음에 드는 선물을 골라주면 예쁘게 포장해서 보내줄게요 🎁");
                    alternatives = List.of(
                            String.format("생일 축하해 %s! 오늘 하루만큼은 온전히 너만을 위해 맛있는 것도 많이 먹고 행복하기를 ✨", receiver),
                            String.format("소중한 %s님의 특별한 날, 늘 곁에서 힘이 되어주어 고마워요. 생일 축하해요 💖", receiver),
                            String.format("Happy Birthday! %s님의 모든 계절이 반짝이길 진심으로 바랄게요 🌿", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("%s님 생일 축하! 🎉 선물 고민 100번 하다가 취향 저격하려고 감도 높은 큐레이션으로 준비했어. 딱 골라주기만 해! ✦", receiver);
                    alternatives = List.of(
                            String.format("생일 축하해! 나이 한 살 더 먹은 건 비밀로 해줄게 😉 선물은 네 취향대로 픽해줘!", receiver),
                            String.format("HBD! %s 전용 산타가 준비한 럭셔리 선물 셀렉션 🎁 마음에 드는 걸로 골라줘!", receiver),
                            String.format("오늘의 주인공 %s님! 제일 갖고 싶은 걸로 바로 골라주면 배송 쏴줄게 🚀", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("To. %s\n세상에서 가장 눈부신 당신의 생일을 축하하며. 한 해 동안 묵묵히 빚어낸 당신의 빛나는 시간들에 깊은 찬사를 보냅니다. 당신의 취향에 머무는 가장 아름다운 오브제를 선물합니다.", receiver);
                    alternatives = List.of(
                            String.format("빛나는 당신의 오늘, 생일을 진심으로 축하합니다. 일상에 잔잔한 영감이 머물기를 바랍니다.", receiver),
                            String.format("To. %s | 한 해의 특별한 날을 기념하며, 당신의 공간을 은은하게 채워줄 큐레이션을 전합니다.", receiver),
                            String.format("당신의 새로운 시작과 생일을 축하하며. 깊은 감도를 담은 오브제를 보냅니다.", receiver)
                    );
                }
                break;

            case "HOUSEWARMING":
                recommendedTheme = "emerald";
                recommendedMonogram = "CONG";
                stylingTip = "차분한 에메랄드 테마와 CONG 모노그램 씰로 새로운 보금자리의 안녕을 기원해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("%s님, 새로운 보금자리로의 이사를 진심으로 축하해요! 🏠 공간마다 따스한 온기와 행복한 웃음이 가득 차오르길 응원합니다.", receiver);
                    alternatives = List.of(
                            String.format("새 집에서 시작하는 새로운 매일이 늘 평온하고 포근하기를 바라요 🌿", receiver),
                            String.format("집들이 축하해요! %s님의 감성이 담긴 예쁜 공간에서 늘 행복하세요 ✨", receiver),
                            String.format("새 공간을 채워줄 작은 온기를 보냅니다. 집들이 축하드려요!", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("랜선 집들이 대환영! 🏡 새 집 인테리어 감성을 해치지 않을 힙한 아이템들로만 모았으니 취향대로 골라줘!", receiver);
                    alternatives = List.of(
                            String.format("새 보금자리 입성 축하! 집에서 숨만 쉬어도 돈이 들어오는 명당이 되길 💰", receiver),
                            String.format("내 방보다 좋은 %s네 새 집 축하축하! 조만간 실물 집들이로 쳐들어갈게 😉", receiver),
                            String.format("새 집 필수템 큐레이션 완료! 공간에 딱 맞는 아이템으로 픽해줘 ✦", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("New Home, New Inspiration.\n새로운 공간에 머물 당신의 고요한 순간들을 위하여. 일상의 감도를 높여줄 감각적인 오브제를 전합니다.", receiver);
                    alternatives = List.of(
                            String.format("새로운 보금자리에 따뜻한 빛과 향기가 스며들길 바랍니다. 입주를 축하합니다.", receiver),
                            String.format("공간의 미학을 완성할 감도 높은 큐레이션을 전합니다. 새로운 시작을 축하하며.", receiver),
                            String.format("당신만의 결이 담길 소중한 공간, 그 안에서 피어날 평온한 나날을 응원합니다.", receiver)
                    );
                }
                break;

            case "PROMOTION":
                recommendedTheme = "noir";
                recommendedMonogram = "CONG";
                stylingTip = "절제된 노아르 테마와 CONG 모노그램으로 프로페셔널한 성취를 기념해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("%s님, 이번 멋진 성취를 진심으로 축하드려요! 💼 그동안 쏟으신 열정과 노력이 빛을 발한 순간이라 더욱 기쁩니다. 앞으로의 도약도 늘 응원할게요.", receiver);
                    alternatives = List.of(
                            String.format("새로운 자리에서도 %s님답게 멋지게 해내실 거라 믿어요. 진심으로 축하드립니다 ✨", receiver),
                            String.format("그동안의 땀방울이 만든 멋진 결실! 앞으로 펼쳐질 길을 힘차게 응원합니다 ✦", receiver),
                            String.format("승진/취업을 진심으로 축하드립니다. 오늘만큼은 마음껏 자축하는 시간 되세요 🥂", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("멋지다 %s! 🚀 성공의 냄새가 여기까지 나네. 고생한 자신에게 주는 특급 보상 큐레이션에서 맘에 드는 거 픽해!", receiver);
                    alternatives = List.of(
                            String.format("축 합격/승진! 이제 꽃길만 걷자 🌸 축하 턱은 다음에 기대할게!", receiver),
                            String.format("능력자 %s의 거침없는 질주를 응원하며! 실무 감도 200%% 업그레이드 선물 픽!", receiver),
                            String.format("월급 인상 축하 기념 선물! 맘에 드는 걸로 하나 골라주면 쏜다 💳", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("Bravo on Your Milestone.\n스스로의 한계를 넘어 증명해 낸 당신의 탁월한 성취에 깊은 경의를 표합니다. 다음 챕터를 향한 여정에 품격 있는 응원을 보냅니다.", receiver);
                    alternatives = List.of(
                            String.format("당신의 집념과 열정이 빚어낸 찬란한 도약을 축하합니다. 더 높은 비상을 위하여.", receiver),
                            String.format("탁월함으로 걸어온 당신의 시간들에 찬사를 보내며, 새로운 챕터를 축하합니다.", receiver),
                            String.format("성취의 순간을 더욱 빛내줄 정제된 에디토리얼 셀렉션을 전합니다.", receiver)
                    );
                }
                break;

            case "ROMANCE":
                recommendedTheme = "rose";
                recommendedMonogram = "LOVE";
                stylingTip = "로맨틱한 로즈 테마와 LOVE 모노그램 씰로 사랑의 온도를 전해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("내 소중한 %s, 항상 내 곁에서 따뜻한 온기가 되어주어 고마워 💖 함께 걷는 모든 날들이 내겐 기적 같은 선물이야.", receiver);
                    alternatives = List.of(
                            String.format("우리가 함께한 소중한 시간들을 기념하며, 네가 가장 미소 지을 선물을 골라줘 🌸", receiver),
                            String.format("언제나 날 웃게 해주는 %s에게. 내 마음을 가득 담아 보냅니다 사랑해 ✨", receiver),
                            String.format("너의 평범한 일상도 특별하게 만들어주고 싶어. 사랑을 담아서 💌", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("세상에서 제일 귀여운 %s 맞춤형 선물 대령이오! 💘 1등 남자친구/여자친구가 준비했으니 맘껏 골라봐!", receiver);
                    alternatives = List.of(
                            String.format("내 사랑 %s! 어떤 선물을 골라도 다 찰떡일 거야. 빨리 골라줘 보고 싶어 💕", receiver),
                            String.format("사랑과 애정이 듬뿍 담긴 선물함 도착! 선택권은 오직 당신에게만 ✦", receiver),
                            String.format("오늘도 사랑스러운 %s에게 바치는 취향저격 선물 컬렉션 🎁", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("To My Endless Inspiration.\n너와 함께 숨 쉬는 모든 계절이 아름다운 영감이 됩니다. 깊은 애정과 고요한 진심을 담아 너만을 위한 큐레이션을 전합니다.", receiver);
                    alternatives = List.of(
                            String.format("찰나의 순간도 온전히 기억하고 싶은 당신에게, 변치 않을 마음을 전합니다.", receiver),
                            String.format("우리의 시간이 빚어낸 가장 다정한 페이지를 펼치며. 사랑을 담아.", receiver),
                            String.format("당신의 눈동자에 비친 세상이 늘 아름답기를 바라며. 사랑하는 마음을 전합니다.", receiver)
                    );
                }
                break;

            case "COMFORT":
                recommendedTheme = "ivory";
                recommendedMonogram = "LUCK";
                stylingTip = "편안한 아이보리 린넨 테마와 LUCK 모노그램 씰로 평온한 쉼을 선물해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("%s님, 요즘 여러모로 마음 쓸 일이 많았죠? 🌿 온전히 자신만을 위해 깊은 숨을 쉬고 편안한 쉼을 누릴 수 있기를 바라요. 늘 곁에서 응원하고 있어요.", receiver);
                    alternatives = List.of(
                            String.format("지친 하루 끝에 따스한 위로가 닿기를. 당신은 충분히 잘해내고 있어요 🤍", receiver),
                            String.format("잠시 무거운 짐은 내려두고, 평온한 티타임과 휴식을 즐겨주세요.", receiver),
                            String.format("힘든 시기도 지나가고 곧 따스한 봄날이 올 거예요. 늘 응원해요 🌿", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("열심히 달린 %s, 오늘만큼은 강제 힐링 모드 돌입! 🍵 몸과 마음을 녹여줄 꿀템들로 모았으니 골라봐!", receiver);
                    alternatives = List.of(
                            String.format("현생에 지친 %s을 위한 특효약 큐레이션! 마음에 쏙 드는 걸로 힐링해 ✦", receiver),
                            String.format("스트레스 훌훌 털어버릴 힐링템 도착! 어서 골라서 평온 찾자 🧘", receiver),
                            String.format("오늘 하루도 고생 많았어 토닥토닥! 선물 하나 픽하고 푹 쉬어!", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("A Gentle Pause for Your Mind.\n숨 가쁘게 흘러가는 시간 속에서 온전한 비움과 회복의 여백이 머물기를 바랍니다. 당신의 지친 마음에 건네는 고요한 위로입니다.", receiver);
                    alternatives = List.of(
                            String.format("고요한 쉼의 미학. 당신의 하루 끝에 따뜻한 안식을 전합니다.", receiver),
                            String.format("비워내야 다시 채워지는 것들을 위하여. 평온한 휴식을 선물합니다.", receiver),
                            String.format("흐트러진 마음의 결을 정돈해 줄 은은한 향과 온기를 전합니다.", receiver)
                    );
                }
                break;

            case "THANK_YOU":
            default:
                recommendedTheme = "ivory";
                recommendedMonogram = "THX";
                stylingTip = "클래식 아이보리 테마와 THX 모노그램 씰로 진심 어린 감사의 품격을 전해보세요.";
                if ("WARM".equals(tone)) {
                    mainMessage = String.format("%s님, 늘 따뜻한 배려와 든든한 응원으로 힘이 되어주셔서 진심으로 감사드려요 💌 소중한 마음에 보답하고자 작은 큐레이션을 준비했습니다.", receiver);
                    alternatives = List.of(
                            String.format("언제나 곁에서 큰 힘이 되어주셔서 고마워요. 따스한 마음을 담아 보냅니다 ✨", receiver),
                            String.format("전하지 못한 고마운 마음을 선물에 담았어요. 마음에 드는 걸로 골라주세요 🎁", receiver),
                            String.format("소중한 인연에 감사드리며, %s님의 일상에 행복이 가득하길 바랍니다 🌿", receiver)
                    );
                } else if ("WITTY".equals(tone)) {
                    mainMessage = String.format("%s님 압도적 감사! 🙇‍♂️ 늘 챙겨주신 은혜에 보답하고자 엄선한 선물 리스트입니다. 원픽을 골라주세요!", receiver);
                    alternatives = List.of(
                            String.format("감사의 마음을 담아 쏩니다! 탕진잼 큐레이션에서 맘에 드는 걸로 픽해주세요 ✦", receiver),
                            String.format("늘 든든한 %s님 최고! 작은 성의지만 기분 좋은 선물이 되길 바라요 😉", receiver),
                            String.format("고마운 마음 꾹꾹 눌러 담은 선물함! 취향대로 골라주시면 배송 슝 🚀", receiver)
                    );
                } else { // EDITORIAL
                    mainMessage = String.format("With Sincere Gratitude.\n베풀어주신 온화한 배려와 귀한 마음에 깊은 감사를 드립니다. 당신의 일상에 잔잔한 기쁨과 향기를 더해줄 에디토리얼 셀렉션을 보냅니다.", receiver);
                    alternatives = List.of(
                            String.format("깊은 감사와 존경의 마음을 담아, 당신의 품격에 어울리는 오브제를 전합니다.", receiver),
                            String.format("소중한 동행에 감사드리며, 당신의 매일에 평온한 감도가 깃들기를 바랍니다.", receiver),
                            String.format("말로는 다 전하지 못한 진심을 담아, 정제된 큐레이션을 전합니다.", receiver)
                    );
                }
                break;
        }

        return AiMessageResponse.builder()
                .situation(situation)
                .tone(tone)
                .generatedMessage(mainMessage)
                .alternativeSnippets(alternatives)
                .recommendedTheme(recommendedTheme)
                .recommendedMonogram(recommendedMonogram)
                .stylingTip(stylingTip)
                .build();
    }
}
