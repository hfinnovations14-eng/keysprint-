import React, { useState } from 'react';
import { ScreenSwitcherToolbar, ViewportMode, SCREEN_INVENTORY } from './components/layout/ScreenSwitcherToolbar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CarModelId } from './components/common/SvgCar';
import { AuthProvider, useAuth } from './context/AuthContext';

// PUBLIC SCREENS
import { Screen01Homepage } from './screens/public/Screen01Homepage';
import { Screen02HowToPlay } from './screens/public/Screen02HowToPlay';
import { Screen03About } from './screens/public/Screen03About';

// AUTH SCREENS
import { Screen04SignUp } from './screens/auth/Screen04SignUp';
import { Screen05Login } from './screens/auth/Screen05Login';
import { Screen06ForgotPassword } from './screens/auth/Screen06ForgotPassword';
import { Screen07ResetPassword } from './screens/auth/Screen07ResetPassword';
import { Screen08EmailVerification } from './screens/auth/Screen08EmailVerification';
import { Screen09GuestEntry } from './screens/auth/Screen09GuestEntry';

// GAMEPLAY SCREENS
import { Screen10RaceModeSelect } from './screens/gameplay/Screen10RaceModeSelect';
import { Screen11MatchmakingQueue } from './screens/gameplay/Screen11MatchmakingQueue';
import { Screen12PreRaceLobby } from './screens/gameplay/Screen12PreRaceLobby';
import { Screen13LiveRace } from './screens/gameplay/Screen13LiveRace';
import { Screen14Practice } from './screens/gameplay/Screen14Practice';
import { Screen15BotRace } from './screens/gameplay/Screen15BotRace';
import { Screen16RaceResults } from './screens/gameplay/Screen16RaceResults';
import { Screen17CreateRoom } from './screens/gameplay/Screen17CreateRoom';
import { Screen18RoomLobby } from './screens/gameplay/Screen18RoomLobby';

// ACCOUNT SCREENS
import { Screen19Dashboard } from './screens/account/Screen19Dashboard';
import { Screen20Profile } from './screens/account/Screen20Profile';
import { Screen21EditProfile } from './screens/account/Screen21EditProfile';
import { Screen22Statistics } from './screens/account/Screen22Statistics';
import { Screen23RaceHistory } from './screens/account/Screen23RaceHistory';

// GARAGE & SHOP
import { Screen24Garage } from './screens/garage_shop/Screen24Garage';
import { Screen25Shop } from './screens/garage_shop/Screen25Shop';
import { Screen26PurchaseModal } from './screens/garage_shop/Screen26PurchaseModal';
import { Screen27Achievements } from './screens/garage_shop/Screen27Achievements';
import { Screen28DailyChallenges } from './screens/garage_shop/Screen28DailyChallenges';

// SOCIAL & TOURNAMENTS
import { Screen29Leaderboard } from './screens/social/Screen29Leaderboard';
import { Screen30Friends } from './screens/social/Screen30Friends';
import { Screen31Notifications } from './screens/social/Screen31Notifications';
import { Screen32Tournaments } from './screens/social/Screen32Tournaments';

// PRACTICE & LEARNING
import { Screen33PracticeModes } from './screens/learning/Screen33PracticeModes';
import { Screen34PracticeResults } from './screens/learning/Screen34PracticeResults';

// SETTINGS & SUPPORT
import { Screen35Settings } from './screens/settings/Screen35Settings';
import { Screen36HelpFAQ } from './screens/settings/Screen36HelpFAQ';
import { Screen37ContactReport } from './screens/settings/Screen37ContactReport';
import { Screen38Legal } from './screens/settings/Screen38Legal';
import { Screen39SystemStates } from './screens/settings/Screen39SystemStates';

// ADMIN PANEL
import { AdminLayout } from './screens/admin/AdminLayout';
import { Admin01Overview } from './screens/admin/Admin01Overview';
import { Admin02UserManagement } from './screens/admin/Admin02UserManagement';
import { Admin03PassageCMS } from './screens/admin/Admin03PassageCMS';
import { Admin04GameConfig } from './screens/admin/Admin04GameConfig';
import { Admin05GarageShopConfig } from './screens/admin/Admin05GarageShopConfig';
import { Admin06RewardsXPConfig } from './screens/admin/Admin06RewardsXPConfig';
import { Admin07AntiCheat } from './screens/admin/Admin07AntiCheat';
import { Admin08Analytics } from './screens/admin/Admin08Analytics';
import { Admin09StaffAudit } from './screens/admin/Admin09StaffAudit';

// RESPONSIVE & OVERVIEW
import { ScreenResponsiveViews } from './screens/responsive/ScreenResponsiveViews';
import { ScreenOverviewBoard } from './screens/overview/ScreenOverviewBoard';

const AppContent: React.FC = () => {
  const { user, updateCoins, equipCar } = useAuth();
  const [currentScreenId, setCurrentScreenId] = useState<string>('screen-01');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');

  const liveCoins = user?.stats?.coins ?? 2450;
  const liveLevel = user?.stats?.level ?? 12;
  const equippedCarItem = user?.inventory?.find(i => i.isEquipped);
  const liveEquippedCar: CarModelId = (equippedCarItem?.itemId as CarModelId) || 'blaze';

  const isAdminScreen = currentScreenId.startsWith('admin-');

  // Handle Coin deductions from shop
  const handlePurchaseItem = (cost: number) => {
    updateCoins(Math.max(0, liveCoins - cost));
  };

  // Render Screen Content
  const renderScreen = () => {
    // ADMIN SCREENS (Wrapped in AdminLayout)
    if (isAdminScreen) {
      return (
        <AdminLayout
          currentAdminId={currentScreenId}
          onNavigateAdmin={(id) => setCurrentScreenId(id)}
          onExitAdmin={() => setCurrentScreenId('screen-01')}
        >
          {currentScreenId === 'admin-01' && <Admin01Overview />}
          {currentScreenId === 'admin-02' && <Admin02UserManagement />}
          {currentScreenId === 'admin-03' && <Admin03PassageCMS />}
          {currentScreenId === 'admin-04' && <Admin04GameConfig />}
          {currentScreenId === 'admin-05' && <Admin05GarageShopConfig />}
          {currentScreenId === 'admin-06' && <Admin06RewardsXPConfig />}
          {currentScreenId === 'admin-07' && <Admin07AntiCheat />}
          {currentScreenId === 'admin-08' && <Admin08Analytics />}
          {currentScreenId === 'admin-09' && <Admin09StaffAudit />}
        </AdminLayout>
      );
    }

    // REGULAR & SHOWCASE SCREENS
    switch (currentScreenId) {
      // SECTION A — PUBLIC
      case 'screen-01':
        return <Screen01Homepage onNavigate={setCurrentScreenId} />;
      case 'screen-02':
        return <Screen02HowToPlay onNavigate={setCurrentScreenId} />;
      case 'screen-03':
        return <Screen03About onNavigate={setCurrentScreenId} />;

      // SECTION B — AUTH
      case 'screen-04':
        return <Screen04SignUp onNavigate={setCurrentScreenId} />;
      case 'screen-05':
        return <Screen05Login onNavigate={setCurrentScreenId} />;
      case 'screen-06':
        return <Screen06ForgotPassword onNavigate={setCurrentScreenId} />;
      case 'screen-07':
        return <Screen07ResetPassword onNavigate={setCurrentScreenId} />;
      case 'screen-08':
        return <Screen08EmailVerification onNavigate={setCurrentScreenId} />;
      case 'screen-09':
        return <Screen09GuestEntry onNavigate={setCurrentScreenId} />;

      // SECTION C — GAMEPLAY
      case 'screen-10':
        return <Screen10RaceModeSelect onNavigate={setCurrentScreenId} />;
      case 'screen-11':
        return <Screen11MatchmakingQueue onNavigate={setCurrentScreenId} />;
      case 'screen-12':
        return <Screen12PreRaceLobby onNavigate={setCurrentScreenId} />;
      case 'screen-13':
        return <Screen13LiveRace onNavigate={setCurrentScreenId} />;
      case 'screen-14':
        return <Screen14Practice onNavigate={setCurrentScreenId} />;
      case 'screen-15':
        return <Screen15BotRace onNavigate={setCurrentScreenId} />;
      case 'screen-16':
        return <Screen16RaceResults onNavigate={setCurrentScreenId} />;
      case 'screen-17':
        return <Screen17CreateRoom onNavigate={setCurrentScreenId} />;
      case 'screen-18':
        return <Screen18RoomLobby onNavigate={setCurrentScreenId} />;

      // SECTION D — ACCOUNT
      case 'screen-19':
        return <Screen19Dashboard onNavigate={setCurrentScreenId} level={liveLevel} />;
      case 'screen-20':
        return <Screen20Profile onNavigate={setCurrentScreenId} />;
      case 'screen-21':
        return <Screen21EditProfile onNavigate={setCurrentScreenId} />;
      case 'screen-22':
        return <Screen22Statistics onNavigate={setCurrentScreenId} />;
      case 'screen-23':
        return <Screen23RaceHistory onNavigate={setCurrentScreenId} />;

      // SECTION E — GARAGE & SHOP
      case 'screen-24':
        return (
          <Screen24Garage 
            onNavigate={setCurrentScreenId}
            equippedCarId={liveEquippedCar}
            onEquipCar={(id) => equipCar(id)}
          />
        );
      case 'screen-25':
        return (
          <Screen25Shop 
            onNavigate={setCurrentScreenId}
            coins={liveCoins}
            onPurchaseItem={handlePurchaseItem}
          />
        );
      case 'screen-26':
        return (
          <div className="py-5 text-center">
            <Screen26PurchaseModal
              item={{
                name: 'Golden Flash Hypercar',
                price: 1800,
                category: 'Epic',
                carId: 'golden',
                desc: 'Gold-plated aerodynamic composite chassis.'
              }}
              userCoins={liveCoins}
              onClose={() => setCurrentScreenId('screen-25')}
              onConfirm={handlePurchaseItem}
            />
          </div>
        );
      case 'screen-27':
        return <Screen27Achievements onNavigate={setCurrentScreenId} />;
      case 'screen-28':
        return (
          <Screen28DailyChallenges 
            onNavigate={setCurrentScreenId}
            onClaimReward={(c) => updateCoins(liveCoins + c)}
          />
        );

      // SECTION F — SOCIAL
      case 'screen-29':
        return <Screen29Leaderboard onNavigate={setCurrentScreenId} />;
      case 'screen-30':
        return <Screen30Friends onNavigate={setCurrentScreenId} />;
      case 'screen-31':
        return <Screen31Notifications onNavigate={setCurrentScreenId} />;
      case 'screen-32':
        return <Screen32Tournaments onNavigate={setCurrentScreenId} />;

      // SECTION G — PRACTICE
      case 'screen-33':
        return <Screen33PracticeModes onNavigate={setCurrentScreenId} />;
      case 'screen-34':
        return <Screen34PracticeResults onNavigate={setCurrentScreenId} />;

      // SECTION H — SETTINGS & SUPPORT
      case 'screen-35':
        return <Screen35Settings onNavigate={setCurrentScreenId} />;
      case 'screen-36':
        return <Screen36HelpFAQ onNavigate={setCurrentScreenId} />;
      case 'screen-37':
        return <Screen37ContactReport onNavigate={setCurrentScreenId} />;
      case 'screen-38':
        return <Screen38Legal onNavigate={setCurrentScreenId} />;
      case 'screen-39':
        return <Screen39SystemStates onNavigate={setCurrentScreenId} />;

      // SECTION J & K — RESPONSIVE & OVERVIEW
      case 'responsive-views':
        return <ScreenResponsiveViews onNavigate={setCurrentScreenId} />;
      case 'overview-board':
        return <ScreenOverviewBoard onSelectScreen={setCurrentScreenId} />;

      default:
        return <Screen01Homepage onNavigate={setCurrentScreenId} />;
    }
  };

  return (
    <div className={`app-root viewport-${viewport}`}>
      {/* MASTER TOP TOOLBAR (Allows switching between all 50+ screens & viewports) */}
      <ScreenSwitcherToolbar
        currentScreenId={currentScreenId}
        onSelectScreen={setCurrentScreenId}
        viewport={viewport}
        onSetViewport={setViewport}
      />

      {/* VIEWPORT RESIZING FRAME */}
      <div className={`viewport-frame-container ${viewport}`}>
        <div className="viewport-inner-canvas">
          {/* Main Website Header (unless on Admin screen) */}
          {!isAdminScreen && (
            <Header
              currentScreenId={currentScreenId}
              onNavigate={setCurrentScreenId}
              coins={liveCoins}
              level={liveLevel}
            />
          )}

          {/* Active Screen View */}
          <div className="screen-active-viewport">
            {renderScreen()}
          </div>

          {/* Main Website Footer (unless on Admin screen or Live Race) */}
          {!isAdminScreen && currentScreenId !== 'screen-13' && (
            <Footer onNavigate={setCurrentScreenId} />
          )}
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
